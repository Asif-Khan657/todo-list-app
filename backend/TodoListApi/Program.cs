using TodoListApi.Data;
using TodoListApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Singleton for in memory data
builder.Services.AddSingleton<ITodoListData, TodoListData>();

// TodoListService is scoped so API creates a service instnace per request
builder.Services.AddScoped<ITodoListService, TodoListService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

public partial class Program {}