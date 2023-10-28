import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
    const categoriesToInsert = [
        ['Palavras Cognatas', 'Esta estratégia tem por objetivo localizar as palavras parecidas (na escrita e no significado) com a língua materna do leitor.', 'Significado semelhante', 'yellow'],
        ['Palavras Falsas Cognatas', 'Esta estratégia tem por objetivo localizar as palavras parecidas (na escrita), porém que tenham significado diferente da língua materna do leitor.', 'Significado diferente', 'green'],
        ['Evidências Tipográficas', 'Esta estratégia visa localizar pistas dadas pelo próprio texto: elementos visuais, datas, números, tabelas gráficas, imagens, gráficos, figuras etc, que possam colaborar para o entendimento do texto.', 'Informações adicionais', 'pink'],
        ['Scanning', 'Esta estratégia visa encontrar informações específicas no texto: uma data, um horário, um nome, determinada palavras-chaves ou expressão, etc.', 'Palavras-chaves', 'plum'],
        ['Skimming', 'Esta estratégia é comumente utilizada para encontrar informações no texto para compreendermos o assunto que ele aborda sem que façamos uma leitura completa do texto. Os nossos olhos passam rapidamente pelo texto, buscando a informação que precisamos (KLEIMAN, 2004).', 'Ideia geral/central do texto', 'orange'],
        ['Background', 'Esta estratégia consiste em o leitor utilizar os seus conhecimentos prévios sobre a língua para reconhecer as ideias, estruturas sintáticas e até concepções do autor para compreender o texto e o seu significado.', 'Conhecimento prévio', 'silver']
    ]

    const pointsCategories = [
        ['Aplicar técnicas de leitura', 'Estude seus artigos ou de seus amigos para fortalecer ainda mais seus conhecimentos!', 50],
        ['Upload de artigo', 'Colecione artigos para estudar a qualquer momento e compartilhe (se quiser) com o mundo!', 20],
        ['Colaborar via sino', 'Ajude alguém que está necessitando da ajuda de um especialista!', 30],
        ['Deixar comentários', 'Compartilhe sua opinião com a comunidade! Sua opinião é valiosa e ajuda a nossa plataforma a enriquecer cada vez mais.', 15]
    ]
    for (let i = 0; i < categoriesToInsert.length; i++) {
        const category = categoriesToInsert[i];
        await prisma.categories.upsert({
          where: { id: i + 1 },
          update: {},
          create: {
            category: category[0],
            description: category[1],
            resumedDescription: category[2],
            color: category[3]
          },
        });
      }
      for (let index = 0; index < pointsCategories.length; index++) {
        const category = pointsCategories[index];
        await prisma.pointCategories.upsert({
            where: {id: index + 1},
            update: {},
            create: {
                category: String(category[0]),
                description: String(category[1]),
                value: Number(category[2])
            }
        });
      }
    }
    main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })