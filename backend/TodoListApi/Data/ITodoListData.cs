using TodoListApi.Models;

namespace TodoListApi.Data;

public interface ITodoListData
{
    IReadOnlyList<TodoItem> GetAll();
    
    TodoItem? GetById(Guid id);

    bool Add(TodoItem todoItem);

    bool Update(TodoItem item);

    bool Delete(Guid id);
}