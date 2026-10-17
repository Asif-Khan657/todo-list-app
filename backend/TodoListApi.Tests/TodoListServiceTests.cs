using TodoListApi.Data;
using TodoListApi.Services;

namespace TodoListApi.Tests;

public sealed class TodoListServiceTests
{
    private readonly TodoListData _todoListData = new();
    private readonly TodoListService _todoListService;

    public TodoListServiceTests()
    {
        _todoListService = new TodoListService(_todoListData);
    }

    [Fact]
    public void GetAll_ShouldReturnAllItems()
    {
        var item1 = _todoListService.Create("First Item");
        var item2 = _todoListService.Create("Second Item");
        var item3 = _todoListService.Create("Third Item");

        var items = _todoListService.GetAll();

        Assert.Equal(items.Count, _todoListService.GetAll().Count);
        Assert.All(items, item => Assert.Contains(item.Id, new[] { item1.Id, item2.Id, item3.Id }));
    }

    [Fact]
    public void GetById_ShouldReturnExistingItem()
    {
        var created = _todoListService.Create("Buy books");

        var result = _todoListService.GetById(created.Id);

        Assert.NotNull(result);
        Assert.Equal(created.Id, result.Id);
        Assert.Equal("Buy books", result.Title);
    }

    [Fact]
    public void GetById_WhenItemDoesNotExist_ShouldReturnNull()
    {
        Assert.Null(_todoListService.GetById(Guid.NewGuid()));
    }

    [Fact]
    public void Create_ShouldTrimTitleAndAssignDefaults()
    {
        var item = _todoListService.Create(" Goto gym ");

        Assert.NotEqual(Guid.Empty, item.Id);
        Assert.Equal("Goto gym", item.Title);
        Assert.False(item.IsCompleted);
        Assert.NotEqual(default, item.CreatedAt);
    }

    [Fact]
    public void Update_ShouldChangeTitleUpdatedAtAndCompletionStatus()
    {
        var created = _todoListService.Create("Plan a trip");

        var originalUpdatedAt = created.UpdatedAt;

        Assert.Null(originalUpdatedAt);

        var updated = _todoListService.Update(
            created.Id,
            "Arrange meeting",
            true);

        Assert.NotNull(updated);

        var result = _todoListService.GetById(created.Id);

        Assert.NotNull(result);
        Assert.Equal("Arrange meeting", result.Title);
        Assert.True(result.IsCompleted);
        Assert.Equal(created.CreatedAt, result.CreatedAt);
        Assert.NotEqual(originalUpdatedAt, result.UpdatedAt);
    }

    [Fact]
    public void Update_WhenItemDoesNotExist_ShouldReturnNull()
    {
        var updated = _todoListService.Update(
            Guid.NewGuid(),
            "Item missing",
            false);

        Assert.Null(updated);
    }

    [Fact]
    public void Delete_ShouldRemoveExistingItem()
    {
        var created = _todoListService.Create("Workshop on Monday");

        var deleted = _todoListService.Delete(created.Id);

        Assert.True(deleted);
        Assert.Null(_todoListService.GetById(created.Id));
    }

    [Fact]
    public void Delete_WhenItemDoesNotExist_ShouldReturnFalse()
    {
        var deleted = _todoListService.Delete(Guid.NewGuid());

        Assert.False(deleted);
    }
}