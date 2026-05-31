CREATE DATABASE IF NOT EXISTS progiv;
USE progiv;

CREATE TABLE IF NOT EXISTS pessoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL
);

INSERT INTO pessoa (nome, idade) 
VALUES ('Anna Bheatryz', 20);

INSERT INTO pessoa (nome, idade) 
VALUES ('Maria Antônia', 11);

SELECT * FROM pessoa;

