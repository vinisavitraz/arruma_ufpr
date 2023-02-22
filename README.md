# arruma_ufpr

Software para controle de tickets de incidentes relacionados a manutenção predial na UFPR


## Tecnologias

- Javascript + Typescript (NestJS)
- Postgres (PrismaORM)

## Funcionalidades

- Gerenciamento de incidentes
- Gerenciamento de tipos de incidente
- Gerenciamento de locais de incidente
- Gerenciamento de itens de incidente
- Gerenciamento de usuários
- Envio de email

## Rodando localmente

Comandos devem ser executados via CMD.

Clonar o projeto via GIT:

```bash
  git clone https://github.com/vinisavitraz/arruma_ufpr.git
```

Entrar na pasta do projeto

```bash
  cd arruma_ufpr
```

Com o docker aberto na máquina, executar o comando para iniciar os containers dentro da pasta do projeto:

```bash
  docker-compose up
```

Esse comando vai criar os containers necessários para a aplicação funcionar, como container do servidor e do banco de dados PostgreSQL, junto com a base da dados `arruma_ufpr`.
Assim que o processo de inicialização dos containers terminar, abrir um novo CMD, acessar a pasta do projeto e executar:

```bash
  docker exec -it arruma_ufpr sh
```

Esse comando vai acessar diretamente o CMD do próprio container com o servidor. Utilizando o CMD do servidor, é necessário executar um novo comando: 

```bash
  npx prisma migrate reset
```

Esse comando vai criar as tabelas e dados iniciais na base de dados.
Agora, como último passo, é preciso reiniciar o docker e o sistema vai estar configurado!

```bash
docker-compose down --remove-orphans
```
```bash
docker-compose up
```

Agora o sistema vai estar disponível acessando a URL:

http://localhost:3000/dashboard/login

Para acessar o sistema, utilizar o usuário padrão de administrador:

Email: admin@mail.com
Senha: 1234

Com a aplicação rodando, o acesso a base de dados fica disponível via Postgres usando as seguintes credenciais: 

- Host: localhost
- Port: 5432
- Database: arruma_ufpr
- User: postgres
- Senha: admin


## Documentação da API

Após iniciar a aplicação, a documentação da API fica disponível no endpoint `http://localhost:3000/api`
