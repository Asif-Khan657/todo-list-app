using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using TodoListApi.Models;

namespace TodoListApi.Tests;

public sealed class TodosListApiTests : IDisposable
{
    private readonly WebApplicationFactory<Program> _factory = new();
    private readonly HttpClient _client;

    public TodosListApiTests()
    {
        _client = _factory.CreateClient();
    }

    public void Dispose()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [Fact]
    public async Task GetAll_WhenNothingAdded_ReturnsEmptyList()
    {
        var items = await _client.GetFromJsonAsync<List<TodoItem>>("/api/todos");

        Assert.NotNull(items);
        Assert.Empty(items);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Create_WithBlankTitle_ReturnsBadRequest(string title)
    {
        var response = await _client.PostAsJsonAsync("/api/todos", new { title });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_WithTitleOver200Characters_ReturnsBadRequest()
    {
        var response = await _client.PostAsJsonAsync("/api/todos", new { title = new string('a', 201) });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_ValidTitle_ReturnsCreatedAndLocationHeader()
    {
        var response = await _client.PostAsJsonAsync("/api/todos", new { title = "  Buy milk  " });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var item = await response.Content.ReadFromJsonAsync<TodoItem>();
        Assert.NotNull(item);
        Assert.Equal("Buy milk", item.Title);
        Assert.False(item.IsCompleted);
        Assert.Contains(item.Id.ToString(), response.Headers.Location?.ToString());

        var fetched = await _client.GetFromJsonAsync<TodoItem>($"/api/todos/{item.Id}");
        Assert.Equal(item.Id, fetched?.Id);
    }

    [Fact]
    public async Task GetById_UnknownId_ReturnsNotFound()
    {
        var response = await _client.GetAsync($"/api/todos/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_InvalidTitle_ReturnsBadRequest()
    {
        var created = await CreateAsync("Valid");
        var response = await _client.PutAsJsonAsync(
            $"/api/todos/{created.Id}", new { title = "", isCompleted = true });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Update_ExistingItem_ReturnsUpdatedItem()
    {
        var created = await CreateAsync("old");

        var response = await _client.PutAsJsonAsync(
            $"/api/todos/{created.Id}", new { title = "new", isCompleted = true });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<TodoItem>();
        Assert.Equal("new", updated!.Title);
        Assert.True(updated.IsCompleted);
    }

    [Fact]
    public async Task Update_WrongId_ReturnsNotFound()
    {
        var response = await _client.PutAsJsonAsync(
            $"/api/todos/{Guid.NewGuid()}", new { title = "x", isCompleted = false });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ExistingItem_ReturnsNoContentAndRemovesIt()
    {
        var created = await CreateAsync("temp");

        var response = await _client.DeleteAsync($"/api/todos/{created.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var lookup = await _client.GetAsync($"/api/todos/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, lookup.StatusCode);
    }

    [Fact]
    public async Task Delete_WrongId_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync($"/api/todos/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private async Task<TodoItem> CreateAsync(string title)
    {
        var response = await _client.PostAsJsonAsync("/api/todos", new { title });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<TodoItem>())!;
    }
}