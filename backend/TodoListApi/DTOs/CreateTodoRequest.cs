using System.ComponentModel.DataAnnotations;

namespace TodoListApi.DTOs;

public sealed record CreateTodoRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;
}