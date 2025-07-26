import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  createdAt: Date;
}

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      text: "Review Q4 sales data",
      completed: true,
      priority: "high",
      createdAt: new Date(),
    },
    {
      id: "2",
      text: "Build customer segmentation model",
      completed: false,
      priority: "medium",
      createdAt: new Date(),
    },
    {
      id: "3",
      text: "Update forecasting dashboard",
      completed: false,
      priority: "low",
      createdAt: new Date(),
    },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: "medium",
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  const getPriorityBg = (priority: string, completed: boolean) => {
    if (completed) return "border-green-200 bg-green-50";
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-slate-200";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center space-x-3 p-3 border rounded-lg ${getPriorityBg(
              todo.priority,
              todo.completed
            )}`}
          >
            <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
            <div className="flex-1">
              <p
                className={`text-sm ${
                  todo.completed ? "line-through text-slate-500" : "text-slate-700"
                }`}
              >
                {todo.text}
              </p>
              <p className={`text-xs ${getPriorityColor(todo.priority)}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} priority
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
              className="text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex space-x-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
