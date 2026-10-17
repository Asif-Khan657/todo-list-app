using System.Collections.Concurrent;
using TodoListApi.Models;

namespace TodoListApi.Data;

public sealed class TodoListData : ITodoListData
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _todoListItems = new();

    public IReadOnlyList<TodoItem> GetAll()
    {
        return _todoListItems.Values.OrderBy(item => item.CreatedAt).ToList();
    }

    public TodoItem? GetById(Guid id)
    {
        return _todoListItems.GetValueOrDefault(id);
    }

    public bool Add(TodoItem todoItem)
    {
        if (_todoListItems.TryAdd(todoItem.Id, todoItem))
        {
            return true;
        }
        return false;
    }

    public bool Update(TodoItem item)
    {
        while (_todoListItems.TryGetValue(item.Id, out var existing))
        {
            if (_todoListItems.TryUpdate(item.Id, item, existing))
            {
                return true;
            }
        }

        return false;
    }

    public bool Delete(Guid id)
    {
        return _todoListItems.TryRemove(id, out _);
    }
}