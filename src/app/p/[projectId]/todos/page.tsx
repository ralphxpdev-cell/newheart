import { getTodos } from '@/actions/todos'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ListTodo } from 'lucide-react'
import TodoForm from '@/components/todos/todo-form'

export default async function TodosPage({ params }: { params: { projectId: string } }) {
  const todos = await getTodos(params.projectId)

  const pendingTodos = todos.filter(t => t.status !== 'done')
  const doneTodos = todos.filter(t => t.status === 'done')

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">빠른 추가</h3>
        <TodoForm projectId={params.projectId} />
      </Card>

      {/* Pending Todos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">진행 중인 업무 ({pendingTodos.length})</h3>
        {pendingTodos.length === 0 ? (
          <Card className="p-12 text-center">
            <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">진행 중인 업무가 없습니다.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingTodos.map((todo) => (
              <Card key={todo.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{todo.title}</h4>
                      <Badge variant={
                        todo.priority === 'high' ? 'destructive' :
                        todo.priority === 'mid' ? 'secondary' : 'outline'
                      }>
                        {todo.priority === 'high' ? '높음' :
                         todo.priority === 'mid' ? '중간' : '낮음'}
                      </Badge>
                      <Badge variant="outline">{todo.category}</Badge>
                      <Badge variant={
                        todo.status === 'doing' ? 'default' : 'secondary'
                      }>
                        {todo.status === 'doing' ? '진행중' : '대기'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {todo.due_date && (
                        <span>마감: {new Date(todo.due_date).toLocaleDateString('ko-KR')}</span>
                      )}
                      {todo.requester && (
                        <span>요청: {todo.requester}</span>
                      )}
                      {todo.assignee && (
                        <span>담당: {todo.assignee}</span>
                      )}
                      {todo.spaces && todo.spaces.length > 0 && (
                        <span>공간: {todo.spaces.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {todo.memo && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">
                    {todo.memo}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Done Todos */}
      {doneTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">완료된 업무 ({doneTodos.length})</h3>
          <div className="space-y-2">
            {doneTodos.map((todo) => (
              <Card key={todo.id} className="p-4 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm line-through">{todo.title}</h4>
                      <Badge variant="outline" className="text-xs">{todo.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {todo.due_date && `마감: ${new Date(todo.due_date).toLocaleDateString('ko-KR')}`}
                      {todo.assignee && ` · 담당: ${todo.assignee}`}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
