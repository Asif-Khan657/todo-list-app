using Microsoft.AspNetCore.Mvc;
using TodoListApi.DTOs;
using TodoListApi.Models;
using TodoListApi.Services;

namespace TodoListApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TodosController(ITodoListService todoListService)
    : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<TodoItem>> GetAll()
    {
        return Ok(todoListService.GetAll());
    }

    [HttpGet("{id:guid}")]
    public ActionResult<TodoItem> GetById(Guid id)
    {
        var item = todoListService.GetById(id);

        if (item is null)
        {
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPost]
    public ActionResult<TodoItem> Create(CreateTodoRequest request)
    {
        var item = todoListService.Create(request.Title);

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<TodoItem> Update(Guid id, UpdateTodoRequest request)
    {
        var updatedItem = todoListService.Update(
            id,
            request.Title,
            request.IsCompleted);

        if (updatedItem is null)
        {
            return NotFound();
        }

        return Ok(updatedItem);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        if (!todoListService.Delete(id))
        {
            return NotFound();
        }

        return NoContent();
    }
}