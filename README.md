# CV Confidencial  
  
O serviço recebe um CV em PDF e transforma ele em um CV Confidencial para enviar para recrutadores que enviam vagas confidenciais.  

# Tecnologias  
  
Esse serviço usa duas linguagens como runtime para lambdas em um microsserviço e pode ser dividido em duas partes, a primeira delas é um handler http que gera um URL para envio de PDF usando um runtime nodejs14 escrito com typescript, o segundo é um serviço utilizando o runtime python3.8 feito com poetry que gerencia a modificação de um PDF e o armazenamento desse novo arquivo em um bucket no S3 para poder ser acessado pelas pessoas que estão utilizando o serviço. 