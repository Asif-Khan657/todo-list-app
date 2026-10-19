using TodoListApi.Data;
using TodoListApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Singleton for in memory data
builder.Services.AddSingleton<ITodoListData, TodoListData>();

// TodoListService is scoped so API creates a service instnace per request
builder.Services.AddScoped<ITodoListService, TodoListService>();

// Applying CORS policy to allow web requests from angular frontend dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

app.UseCors("AngularFrontend");

app.MapControllers();

app.Run();

public partial class Program {}