using TodoListApi.Data;
using TodoListApi.Models;

namespace TodoListApi.Tests;
public sealed class TodoListDataTests
{
    private readonly TodoListData _data = new();

    [Fact]
    public void GetAll_WhenEmpty_ReturnsEmptyList() => Assert.Empty(_data.GetAll());

    [Fact]
    public void Add_StoresItemAndRejectsDuplicateId()
    {
        var item = NewItem("Bring chocolates");

        Assert.True(_data.Add(item));
        Assert.False(_data.Add(item));
        Assert.Equal(item, _data.GetById(item.Id));
        Assert.Single(_data.GetAll());
    }

    [Fact]
    public void GetAll_ReturnsItemsInCreationOrder()
    {
        var later = NewItem("Later", DateTime.UtcNow.AddMinutes(1));
        var earlier = NewItem("Earlier", DateTime.UtcNow);
        _data.Add(later);
        _data.Add(earlier);

        Assert.Equal(new[] { earlier.Id, later.Id }, _data.GetAll().Select(item => item.Id));
    }

    [Fact]
    public void Update_ReplacesExistingItem()
    {
        var original = NewItem("Original");
        _data.Add(original);
        var updated = original with { Title = "Updated", IsCompleted = true };

        Assert.True(_data.Update(updated));
        Assert.Equal("Updated", _data.GetById(original.Id)?.Title);
        Assert.True(_data.GetById(original.Id)?.IsCompleted);
    }

    [Fact]
    public void Update_UnknownId_ReturnsFalse() => Assert.False(_data.Update(NewItem("Missing")));

    [Fact]
    public void Delete_RemovesItemOnlyOnce()
    {
        var item = NewItem("Remove me");
        _data.Add(item);

        Assert.True(_data.Delete(item.Id));
        Assert.False(_data.Delete(item.Id));
        Assert.Null(_data.GetById(item.Id));
    }

    private static TodoItem NewItem(string title, DateTime? createdAt = null) => new()
    {
        Id = Guid.NewGuid(),
        Title = title,
        CreatedAt = createdAt ?? DateTime.UtcNow
    };
}