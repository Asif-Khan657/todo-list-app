namespace TodoListApi.Models;

public sealed record TodoItem
{
    public required Guid Id { get; init; }
    public required string Title { get; set; }
    public bool IsCompleted { get; set; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; set; }
}