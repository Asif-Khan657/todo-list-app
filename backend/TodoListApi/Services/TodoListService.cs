using TodoListApi.Models;
using TodoListApi.Data;

namespace TodoListApi.Services;

public sealed class TodoListService(ITodoListData todoListData)
    : ITodoListService
{
    public IReadOnlyList<TodoItem> GetAll()
    {
        return todoListData.GetAll();
    }

    public TodoItem? GetById(Guid id)
    {
        return todoListData.GetById(id);
    }

    public TodoItem Create(string title)
    {
        var item = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = title.Trim(),
            CreatedAt = DateTime.Now
        };

        if(!todoListData.Add(item))
        {
            throw new InvalidOperationException("Failed to create todo item");
        }

        return item;
    }

    public TodoItem? Update(Guid id, string title, bool isCompleted)
    {
        var todoItem = todoListData.GetById(id);

        if (todoItem is null)
        {
            return null;
        }

        var updatedItem = new TodoItem
        {
            Id = todoItem.Id,
            Title = title.Trim(),
            IsCompleted = isCompleted,
            CreatedAt = todoItem.CreatedAt,
            UpdatedAt = DateTime.Now
        };

        if (!todoListData.Update(updatedItem))
        {
            return null;
        }

        return updatedItem;
    }

    public bool Delete(Guid id)
    {
        return todoListData.Delete(id);
    }
}
