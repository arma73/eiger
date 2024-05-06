task1:
	npx --package=nx -c 'nx run task-first:test'

task2:
	npx --package=nx -c 'nx run task-second:test'

run2:
	npx --package=nx -c 'nx run task-second:start'
