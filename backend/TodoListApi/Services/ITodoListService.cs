using TodoListApi.Models;

namespace TodoListApi.Services;

public interface ITodoListService
{
    IReadOnlyList<TodoItem> GetAll();

    TodoItem? GetById(Guid id);

    TodoItem Create(string title);

    TodoItem? Update(Guid id, string title, bool isCompleted);

    bool Delete(Guid id);
}
