# Atividade – MySQL e Entidade Pessoa

## Objetivo

Criar uma tabela correspondente à entidade Pessoa desenvolvida na aula anterior, inserir registros e realizar consultas utilizando MySQL.

## Criação do Banco de Dados

```sql
CREATE DATABASE progiv;
USE progiv;
```

## Criação da Tabela

```sql
CREATE TABLE IF NOT EXISTS pessoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL
);
```

## Inserção dos Dados

```sql
INSERT INTO pessoa (nome, idade)
VALUES ('Anna Bheatryz', 20);

INSERT INTO pessoa (nome, idade)
VALUES ('Maria Antônia', 11);
```

## Consulta dos Dados

```sql
SELECT * FROM pessoa;
```

## Resultado Obtido

```text
+----+----------------+-------+
| id | nome           | idade |
+----+----------------+-------+
|  1 | Anna Bheatryz  |    20 |
|  2 | Maria Antônia  |    11 |
+----+----------------+-------+
```

## Conclusão

A tabela Pessoa foi criada com sucesso no MySQL. Dois registros foram inseridos e posteriormente consultados através do comando SELECT, demonstrando o correto funcionamento das operações básicas de persistência e recuperação de dados.
