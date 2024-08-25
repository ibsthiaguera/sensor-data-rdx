
# desafio-radix

Desafio técnico para a vaga de Desenvolvedor Full Stack Pleno.

## Tarefas realizadas

• Modele um banco de dados da sua escolha para o caso de uso apresentado;

• Crie uma API com um endpoint que receba as requisições em tempo real e armazene no banco de dados;

• Alguns dos sensores da planta podem apresentar falhas técnicas, resultando em lacunas nos dados. Para lidar com isso, o fornecedor pode enviar arquivos CSV com os dados perdidos. Adicione na API um endpoint que receba um arquivo CSV, realize o parser dos dados e salve os valores no banco de dados. O formato do csv pode ser encontrado na tabela 1;

• Crie uma tela que exiba o valor médio de cada sensor nas últimas 24 horas, 48 horas, 1 semana ou 1 mês. Sua tela deve possuir gráficos para facilitar a análise;

• Crie uma documentação para a sua solução.

**Bônus**:

• Implemente um mecanismo de autenticação no sistema;

• Crie um relatório de teste de carga para a solução num cenário de 500, 1000, 5000 e 10000 requisições simultâneas;

## Tarefas não realizadas

• Crie testes de integração e unitários para a solução;

• Crie scripts que automatizem o deploy e execução das aplicações;

• Sua solução foi um sucesso e a empresa deseja expandi-la globalmente. Quais componentes extras você adicionaria na solução existente? Desenhe um diagrama para exemplificar a sua proposta de mudança.
## Stack utilizada - *Backend*

- Framework e Ferramentas de Desenvolvimento:

**Express**: Framework web para Node.js usado para construir APIs e aplicativos web.

- Banco de Dados e ORM:

**Prisma**: ORM (Object-Relational Mapping) utilizado para manipulação do banco de dados, facilitando operações de leitura, criação, atualização e exclusão.

- Segurança e Autenticação:

**bcryptjs**: Biblioteca para criptografia de senhas, garantindo que as senhas armazenadas sejam seguras.

**JWT** (JSON Web Token): Usado para autenticação de usuários, permitindo a criação de tokens seguros que validam a identidade dos usuários.
Manipulação de Arquivos e Dados:

**csv-parser**: Biblioteca para parser de arquivos CSV, utilizada para ler e interpretar dados em formato CSV.

**Multer**: Middleware para o Express, usado para gerenciar o upload de arquivos, como os arquivos CSV.

- Ferramentas de Teste de Carga:

**Artillery.io**: Ferramenta de teste de carga que permite simular múltiplas requisições simultâneas para avaliar o desempenho da aplicação sob diferentes níveis de carga. 

**Os relatórios de carga encontram-se no caminho '/backend/tests'.**


## Stack utilizada - *Frontend*

- Framework e Ferramentas de Desenvolvimento:

**Next.js**: Framework React para renderização do lado do servidor (SSR) e geração de sites estáticos, facilitando a construção de aplicações web rápidas e escaláveis.
Visualização de Dados:

**Chart.js**: Biblioteca de gráficos para visualizar dados, utilizada para criar gráficos interativos e visualmente atraentes no frontend.
Requisições HTTP:

**Axios**: Biblioteca para realizar requisições HTTP de forma fácil e eficiente, usada para comunicar o frontend com o backend.
Testes de Carga
## Banco de Dados Modelado

![](https://i.imgur.com/pUo2wF5.jpeg)

## Documentação da API

Insere registro na tabela *user*.

```http
  POST /user
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | Obrigatório
| `email`     | `string` | Obrigatório
| `password`  | `string` | Obrigatório
| `status`    | `string` | Obrigatório

Realiza login do usuário e retorna dados + token para autenticação. Este token deve ser usado na autenticação das outras requisições, com o prefixo **Bearer**.

```http
  POST /auth
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`      | `string` | Obrigatório
| `password`   | `string` | Obrigatório

![Logo](https://i.imgur.com/7rGIeWc.jpeg)

Retorna dados do usuário autenticado. Exemplo a seguir do token necessário a ser passado:

```http
  GET /me
```
![Logo](https://i.imgur.com/eWgpSm1.jpeg)

Retorna dados de todos os registros da tabela *equipment*:

```http
  GET /equipment
```

Insere registro na tabela *equipment*:

```http
  POST /equipment
```

Retorna todos os registros da tabela *sensor_data*:

```http
  GET /sensor_data
```

Insere registro na tabela *sensor_data*:

```http
  POST /sensor_data
```

Realiza upload de arquivo CSV na tabela *sensor_data*:

```http
  POST /sensor_data/upload
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `file`      | `archive.csv` | **Obrigatório**. Upload do arquivo para importação dos dados na tabela *sensor_data*




## Interfaces

Tela de Autenticação:

![](https://i.imgur.com/aEJSIXt.jpeg)

Tela de Cadastre-se:

![](https://i.imgur.com/yOtqQE5.jpeg)

Dashboard, inicializada pelo primeiro equipamento encontrado, com filtro do período das últimas 24 horas:

![](https://i.imgur.com/XwBnyak.jpeg)

Dashboard, com filtro do período das últimas 48 horas:

![](https://i.imgur.com/h7fMRpM.jpeg)

Dashboard, com filtro do período da última semana:

![](https://i.imgur.com/V4heA5c.jpeg)

Dashboard, com filtro do período do último mês:

![](https://i.imgur.com/gETROMT.jpeg)

