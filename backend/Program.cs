using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<TaskeenDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TaskeenDb")));

    builder.Services.AddScoped<IBuildingService, BuildingService>();

builder.Services.AddScoped<IFloorService, FloorService>();
builder.Services.AddScoped<IApartmentService, ApartmentService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IResidentService, ResidentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
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

app.UseMiddleware<Taskeen.Api.Middleware.ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();