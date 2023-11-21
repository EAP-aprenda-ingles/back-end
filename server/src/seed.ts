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

    const schools = [
      'UFRGS - Universidade Federal do Rio Grande do Sul',
      'CNEC-Farroupilha - Faculdade CNEC Farroupilha',
      'CNEC-Santo Ângelo - Instituto Cenecista de Ensino Superior de Santo Ângelo',
      'ESPM-Sul - Escola Superior de Propaganda e Marketing',
      'FACCAT - Faculdades Integradas de Taquara',
      'FACCCA - Faculdade Camaquense de Ciências Contábeis e Administrativas',
      'FEEVALE - Universidade Feevale',
      'FEMA - Fundação Educacional Machado de Assis',
      'FURG - Universidade Federal do Rio Grande',
      'IF Farroupilha - Instituto Federal Farroupilha',
      'IFRS - Instituto Federal do Rio Grande do Sul',
      'IFSul - Instituto Federal Sul-rio-grandense',
      'IPA - Rede Metodista de Educação do Sul',
      'PUCRS - Pontifícia Universidade Católica do Rio Grande do Sul',
      'São Judas Tadeu - Faculdades Integradas São Judas Tadeu',
      'SETREM - Sociedade Educacional Três de Maio',
      'UCPEL - Universidade Católica de Pelotas',
      'UCS - Universidade de Caxias do Sul',
      'UFCSPA - Universidade Federal de Ciências da Saúde de Porto Alegre',
      'UFN - Universidade Franciscana',
      'UFPel - Universidade Federal de Pelotas',
      'UFSM - Universidade Federal de Santa Maria',
      'ULBRA - Universidade Luterana do Brasil',
      'UNICNEC - Centro Universitário Cenecista de Osório',
      'UNICNEC Bento Gonçalves - Faculdade Cenecista de Bento Gonçalves',
      'UNICRUZ - Universidade de Cruz Alta',	
      'UNIJUI - Universidade Regional do Noroeste do Estado do Rio Grande do Sul',
      'UNILASALLE - Universidade La Salle',
      'Unipampa - Universidade Federal do Pampa',
      'UNIRITTER - Centro Universitário Ritter dos Reis',
      'UNISC - Universidade de Santa Cruz do Sul',
      'UNISINOS - Universidade do Vale do Rio dos Sinos',
      'UNIVATES - Universidade do Vale do Taquari',
      'UPF - Universidade de Passo Fundo',
      'URI - Universidade Regional Integrada do Alto Uruguai e das Missões'
    ]
    const hobbies = [
      ['Esportes', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFAUlEQVR4nO2Za4iVRRjHf2u62ZW1C+vaxZKuYAhKdI/CLlttH5XCIsqspNuH1CgSS2qjiKAo06SgG0klUW1BZSFUhEFEitspuxCmFq2267ratuueeOA/MAzzvu+8u+fkRv1hPpx3Zp55nnnuc+B//DdxGHAL8DrwNdAH7AbWA28A84HDGYUwpp4B/gSqBaMfWAEcwSjB5cD2BMarwdgBtO1r5ucCAwFjX2RoYg+wLvg2CMwbzsHHAI3AfsBnwLfAk/qeikvFgGPmR+AKzZ0NfAD0arwPnKk5W/ODt28v0FqG+YuAP4D79Huq1GnEuoHzE2i0BGbzJTCxBA/N2uP2bxfNQhwnJp1KT9H304BN+t6TQOzpwBTs9qeXEKABeC6gsSxl41ORg4/XXKOcaqGn7hhaFElCG/+khACXRPb/BRxVtNHdsj+6gBuAcYmH35wRVUxzPiYAVwN3AGcEcwsyaFieyEXs5tzYBrwMtAOP5dB4K2P/d96aGcCWYH65N39tBo13Um7QbvpEha91CcyE6MzY86jmxwCVjDWmEefEfZF521cac4BdAaEnctbvyBC4SfMn5Wj5FY/OnZH5nUXMHg38DHwO3AWM1/dzPfMyBo9NFOA9CWs3SkkBDLNEI1kAw0zlAduwAZis74vF3AUF+zd6B56aESIrGQJcFVk/zZv/hkRMVuY11a/VoYdIQ0V42zvQolcMM4BfEuP8jd6aDv4B+GHUTDELTbpxC6On56z7tEwYrQValHTcoRYSHwfeBB4CpuTsnaC1m1UjdXh0BlISWQgr5s4DbgKWKlO3KxtfCRyZWEr4wxoYi2whJsrGs/ZZP5GMKapFunIIumFx/x5gkre/2QsEsdGv+srHCznru1OLwbHAIwUZOWsMigmn5tagnA7H/cHZW3PoXpbC/IFBBHHjJ+B5YAlwK3B3gYC7pJExcugsIZYABwEHKDfEzGcw1XEbIjXMh8BHYsicz8eDMpEHgNlqToaC/e/KKVsLzKmaYzZJN2+4xttojNyr770lMmBPhImK/KFZcd6PTtWMMSCHTW6AwsxoEcShXULYjTs8nKGVpRIi1IZ1VodqzSQ9q3TI+V1L2alv84cTKqd7h+30DstCilauD5r51dQR87yDXi245TJauS4wDSvM6oIF3iHmlFm3bJXpWcD+JbSy0qO9xatua4rFEQFit/yx1qwpoZUw3C6iDpiTU4/7cM8klp1T4LQSlhEnUGNM9Q7okha6I/bfpoLMPU6l+IrReTYQwjRpka9msIz5feS2UmJ/qq9srbcpLQwO6E+M/am+siFSIsyspQCW8n8NfMFXc5mMHPOVbREN/17QW5fG7OAAF5HKZuTQV072aPYEwlRS3zxTEdbky1Rix5CqleUevZfUD/d63zqDV4sRYVzwjFFVY9+rWocErfhrZ+l53NGyl29Da1BqbEx8MCC1L1gdsdk93hNLFtwDmBPCZ36zWlMbc2VmPn3zwQtrJUSDSuqwGdmrZ5YX9Ubkym7UmIRMlR1DKj9uj7Scw8I0LyxmjT7vP4VajzUKCparRoQ21et5PW5sDCrSrJVZrtSzyQrgNfnbVwn/XlbUK5h5jwjWbNymZ/ZNwcG7ddAqmcA56nlTMFbr814mXO4o9X9ZChoTmqAy71CLgN9yhLAnyVGP8YpU6yMCdNW6GKwnGoCL5StDMlnr9P6VaAIO3tdM1Ax/A3Do9uAI9x7zAAAAAElFTkSuQmCC'],
      ['Música', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvUlEQVR4nO3WMWpCQRCA4a8RRAJaeQgPIOQetl7AwngDL5CAnY1t7iFoZWPKYAjEyiMYRHjhgTaSbBpnRXg/TP3BbDFL1R1VxyOe8IqP04TUxjNWOKD4ZUJa/IGFw8dbwcU/85YL3mOJF/TwEA0P0UUtCros9B1TVXC2iuqNc1S7xao7mOWCmxjjM9chON/d99wXqGyaQMsPQFi7BLyNhL8T8DwSXifgUSTcT/wwGoIbYHNa+xcmaEWjVa7VD4KydV0QDHmqAAAAAElFTkSuQmCC'],
      ['Artes', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD10lEQVR4nM2acWhVVRzHP83EmROLIDTYHzkWovOfCglMKcxkYoGUNA1WgrNSJqSgRCCVoyaCkIKzjKZTG4sghRkVCCsnkyUqYaiJWOpsCkIwxZnTK2d8Hzwu9917fu9t790vHB6/3z2/7+9877vn3HPOPZAfJgIvA81AN/A/cBX4DlgJzIiJnQrUA18C/wBDwHFxvQCUMQqYDNSpvAV8AZwC7gFBQrkM7JWwVUAH0O8R1w/sUc4ngSqgshAR64A7OZLdBrqAj4GXgEeAmUAj8D1wPaahfcB+4F1gGjAJeB34Sv9Qrjh3A2dZRSxTsBPyDdCiO7oRmAuUJ8Q/pMfL/RNtQCuwAqj2yD0dWAv8DFwAeoFzas9NoMYi5LQCnaA0oAzYrja5f9wL44D76oRjSA+mSMi/vgHusbglMW50yuAXj4460uVIVv5q+Vw/8kaPguZk+YISlQyWyu7EgBYFrcnyhYnDSLpuRRDi2yrbDTjeeE9BrTHESYkLRRDi65JdayF5W0HtMcRJiUdLyKsWkl0K+iCGOClxoQhCfM2y3a83zirouRjipMSFIgjxLZLt5nZeeEJD7wDwcIqEPKY53qDHzGIYS0Twk7Ghoy3E4Q/5ZuOBbar8UQqF7JBvvQ/ByYiX4bgUvBCzJ7MH8cCQKo/P8o1NiZAq+S75CLmoym59kbZH60X5TvgQtKnyag9iy3Urggi+T+Rz05VErFDlDg9iy3Urggi+Xy1v9+oc8/5SCxmvd4jrw4/6kvSJ5OkUCZkn+3cLSbuCGiKISzVqbZK9xSLkfQXtTpGQLtkLLUIyHX5fhJCRerSsfN2y5xtyRA7BpRayWXaTIQd/K6gmRUJqZR/1TVCpgBuhfdhSC6nQHvPd0O5OTtSL4IcCEychH74e+Rb4JPg6Ypmbb+I45MP3uWW5+5cqPzsCieOQD98r8h3zSZD5ZFCeQiFPyXfFJ8Gfqvz8CCSOQz58dfId8kmQazmZBiEtOdoWiboce6xpEHJGvlmW7fv/Qp8VSi1kco5tKq+R65kCEifBylcn+0dDjsh3SamFtMjeYMjBO0XYxLby9cp23zBT9VnBytcp+w1DDnYqqLGAxEmw8n0m+1NDjuEpQKCTCGHiYpdwZ/faZczgpqYq2dPlIyUQ8Vvo+7vznfcVkdnndeN1mvC42nXNEpQ5afAa6UGD2nTYErRcQYM6wuE6/4EiHeGYoA2GJp02cqeIvtXK8L6m8iZ8WKRDNRVa8blR6aiWs1FxA7rBecHNb97MKsU45nRXo6bbNXE53UGBxZZtUgtG4+CZu0nus19eDX4Aaa8HywdktdIAAAAASUVORK5CYII='],
      ['Escrever', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABvElEQVR4nO2ZMUtDMRRGjyAIUlcruFhnF3+Bi45OdRTU6qO1XRzt5ubibjdx1E1XhwrddbcUQQd/gCKitk8C98E1VItC4UZzINDmpZDzvuRSEohEfssYME7ALANXwBvQBS6BeQJiGtgBekAKvIiM+/wEzBEA2/L2UxHZBUaBHHAi/ecEINGTybrWFoGMvPQ/EoBEF6gDtzLplpKZsi6SSbiWSN+MJzMBHMv3M4wvp7L3TMs8WN7s/p7Y7zNGy7i2hOE90VDltZ9MXZ69A5MYIhEBJ1KRviLwKhM+UGM31dgaRpMoec9WvGTKqgi435lOwqeokkmtJ+GWy3c0lERwSWRsWN0TWmLQ2y1FiSESk7BCTMJiEtW/UJ2qA8ZGCStJmP0Xm0QJIyQxCSMkMQmDSdQGjN0KocTWBoyNEsNk9QfHMGaPbEaAjpxi3MlRfnASjgV1pqSbOxHXVCxLOI5k4ofAtScTjEROLlHcBAuqPxPJhyDhWJcJN/lMlsx9CBLI9W8qQhkFWWb6LNa0xKy6dGmJTNO7iOlIaTbN3hfV6hk4BRalNJun7S0ft8zWvOvhILgAbiQZt8wikf/OB+i4E2KlT2dOAAAAAElFTkSuQmCC'],
      ['Tecnologia', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHElEQVR4nO2ZbwrCMAzF36fdST2fTq/VIuI9Nq8RESrM4lib/u/yg3wppMtr9rrAgB3zBPAosB4dMpF7PToipLaONMcA4AbgtTilUjEDGE1N3lwrEEBWXDhCZpN8QHmOi854U5vpiFuPCEkEuXREW6ZyTswI/amNTO1dCFE+iTVAYnbsqCP3iF/tH9NyhXDNHnsEKXZrxXr9QoSo2JuHkPRZJEL8kY7YtGx23YsQFXvzEMQjLkhHSh6abtjsupehUW3kOW1uH0BIbBWUdNbKCYkQNNgRzTR7TijlrZUTSnlr5YTE7OikI7NJ/PxkKc3J1DJxkscEI0honDlCBiPm25mSMRkRrJ+h3UMrpku9Hh0RUltH9MpYkHodu+ANSkYsKecABh8AAAAASUVORK5CYII='],
      ['Viajar', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/klEQVR4nO2ZPWhUQRDHf0iwEQRBUQ/BdJFYprBI0CsULGKhcG20ElNZXrq70tYylWJ5hYopLU4xAWvNGQlIKj+IlRAREXmyMA/Gdd++3ffhneb9YeHudnZm/m/mze7eQIMGDUKxAWwCV6kORtcI2AKWgKmK9F4EXgND12SixkvgfAlD54Dnlk4zdoCbJQi1gAeWzkwin9Tnh8BMhKEzskbrWpZobKvftyMjdBDoAnuyfi+EyCFZ9EW+/wBWgZMeQ0eBuyKbGroDHFYyB4AO8DYyQm1J+XTNGnA6hIh2zjjz3eNcEdKhhFpWGpkoXvb4mzsxk5EuyyXTcMqTcl0rjbqSXiH+Zk/kvMBlC4MrQomVRlH+5hHRJXWzhlKdRuiNlFZTYn0oTWRSkDRE/qeIHAEWpFSafeMp8EHVe++OO24ifUc10aMncsMAIuZBzEmV6sqekz6Mb8A7YB0YyJ51W2TnZF8pTCSPRCIGNZFdMa5xTJxLCo5dh84oIqGG+pJaA3FaoyOOFCUxcOiMJpJiJzC9fHqLjtkcvVFE7hUkgZUaRYj0qyRyI9KIhkmN6ZyH4RujKolMF4iEvqO8KpFavSqJIOVSGwjBknUJqopEKSI2mTycdTi2LodBrSd9f0z5Hqo55308xN9QB9O9xVSy+8B1Sb0sOdfoyLwuraZ8t9Xadt1E7KOIvTGmGHmIfAaOB9iqlYh9FMkic0WOHlmyj8dNpOtxbug4W6165MdKxEcmK6+zIpOHBTlUztZFxOWcr1SuBUTPRcC38VZGRDv3PkfWVcF8VSmxxladRLRzT3JkFyOi4SJi/uiojchixHHlREQ0XO9ir04iLbXGlNrQCOZFw7XOnBJqI2JwAXjmuIZmIWTHDkWlRMaJZN8QufaPdKySLCIv1KRpw82XMDQvOuwyGtvgsXHK+jfGXAv+gFF+C/ioBB/JDW8SO1YrjlbDb7CbNz+l4TJpHatg2B2rrxPWsYrGJHSsVvLSKAaT1rEqjb/VsbpUoe4GDfY9fgF7C5LG47DNDwAAAABJRU5ErkJggg=='],
      ['Natureza', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD8klEQVR4nO2Ya4hVVRTHfzONTuZkijnl2zCFkpweBj5AHDVEENQkoVIrKLEHCNOHKSYdP4yFiPhBxAfiF43GmS++UEHGynzglILikxrM1zDMmI0ypdXklQ3/A4vjuffOvXPPXI/eP2zOOWuds/ZaZ6+119oLcng4MRM4C5wGphNRPAX8CcQ0/hAtcvhSBtQBB3S/jIjhcaBRyk8FJuj+JtCXCOEzKV5vaHtF+4aIoBvwu5SebehjgLtAGzAc2AL8BizmAcV7MuIMkO/jbRfvqtkEnHEvie9i6JLi6jmyiHxtt07BBQH80cD/xoijulYD0wzdjd1kEW9KiYtysSBUm/gZBNwB2oEGE0NtWqkSsoR6KfNpgndGAv8Bs/S83qyCi61CYLWev+sivflASc/FwyJN3gT0SPJduYmfYcC/+nahaG6l/tFKPU8X4LLPr934Ig05m/XtRkPbJNoGQsYITXQdaNa9W51eacpq1yoMMS7YrhgaQIjwXKlaLubuqzoh71vJWGNoNaKtJETUGL/OA/YAxZ2Q94K25ttmBUpMEu1LCMgz7uQFY7IA7whqJXNVQGmzlBBQIuGXQpDrrUA/0SZqrhbtdm5X3AUUZWLCMgl3u02msVOyvza0QwG7Y0UmJtslYfPJPF43JX8f0WYYA37R9VqC6qFDKNAkTthAwsE+30EsDzihxOkS6Enx3+3MJOMk5FxmdE44RyvQW7R3gHW6/9CsTtqokJC1hAvveOyOzA6PAc+aHbJF/PHpTlAnAa7SDRNTTOVQFMCvEn9bumfxv5W4niZ8/CRlywJ4A0xhmfIhbLIEH++Ecr1U5n+vFtFfCuTPgSd8707XfI36iX5sFX9FqkpUmdrnFWCHArJFMZMoSbme1hIpH4szfgVe9n33s3iuoRFvq74B9EzFkCP68KAOR35F6gPqrSeBrzSZ994xFZr9xZ9n2ketvgB23cqYjgzdA3Q6LP7HqbiEX/nNqrVeAy6I5q6jVARWmt3FjR+AN+LId8lvv967BbxqcshJ0T8K+O4tkw7cu0lhs6s7d8zx8YuNG/iHW8FJHZij0HRanAuWij5XtAb9pHLtnlcU7N48SfvL/cxfuai+VBCKFCvNGrXaIFJBoWIvpkz+iXKI151JNNwPfj+eYPenT5lgHEz4KNAR11PwR2C5ed4qlxqq5Fhqyv24TYvTxgdDPXIGYL7iJeZzobfjvO+VLm7cB4/xDNmB66hs87nQecWcv5NJRwzJNsbqOG0NatQZf6aq4kgY4uFFNfCa4gR7ZAzxkK/EWamVuurrK0fGkCB0f1gMccgZ8qAh9si4Vp+IjFgyQ6I27sONiI4ccsiB5LgHFwXUho6+EbYAAAAASUVORK5CYII=']
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
      for (let index = 0; index < schools.length; index++) {
        const school = schools[index];
        await prisma.schools.upsert({
            where: {id: index + 1},
            update: {},
            create: {
                name: school
            }
        });
      }
      for (let index = 0; index < hobbies.length; index++) {
        const hobbie = hobbies[index];
        await prisma.preferences.upsert({
            where: {id: index + 1},
            update: {},
            create: {
                name: hobbie[0],
                icon: hobbie[1]
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