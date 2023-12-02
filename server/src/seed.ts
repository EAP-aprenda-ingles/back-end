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
      ['Administração', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC50lEQVR4nO2ZW4hNURjHf45rMQwa0owH41pSIi+i5kGk5P7Kg+T2IJKSJyVelGiKUl540jQkg1Buh4konQczUy4peVBu5zAUsrXqf2q1Z2/77D3ntM/S/tf3stflrN/6vvWty4FMmTJlclUPAc8xyweBeI7aAIUWRJTVUl6SMWUg/7NHhgO7gMdAP/ANeATsAIa5AjIB6P7H4jTZcXy9g+SAO6rbC6wBGmRrgT6V3QKG1DPIRguiMaC80YJZV88gF1XPeCJM61Wns95AWoAOoGTVM6EUprFWvZKAZqYN0gJ89C3m+0Qr72tj+mhOE6RD36+EDCRKpk2X+rhQpTElalQOpyQQZU1VH1+qNKZEjYr6bkLMaZBOfe9KCGPaXFUfJkyrMaZEjWYBH6LuBxUseLPYZ6Sdfpu1UIsVZiwbpChPBEGkuiFWW14GQvyZqaW8zCPEn5layss8gns2QDfqYFBeTIuzb7mlEdYV9CvwSceGV7Ie4KnsNnANOAccBw4CW3UnXwLMASYOcjz3gCchp4F8FEhvld1unoAKuv4eA3YCy4HpwNAIEC8k/mNlz9F6rjHWKpsNLJQtBVYCm4C9wBHgDHBJMdvjO0iGQZpnoXZgCzBfb2GDBhkDvFGl7wotY+8Uct06qptwOgHsATYAi4CmkD4bNEDz2LAfOA3cVKj+CYD7oYk4Wi2QJGY8cBc4pRBaEPGiOA5ok0fPA8+B3wH9Xge2AZMrBbE1ygqtKVq8i4FVwGZgH3ASuAw8080uCK5fM3xY4WiHThjcanm84PPaL/1eLBAS3vRWCNLM8IsAsJLuLSa7jQzpp9V6GjJe2K797WfUJlhLNWmG263UXrbPwFlgmS+DvVfa92sScAB4qdScqqZpMAUf1Ft9N4/fQTMeuXekqblK2699a8oLAEklnOIqp3fiBz4vHbLWkRMgtkxmtDNTn1K0cyBltSmte74U7KRywG7t9k6DlDVPJ27zD1cmXNJfHzV6Y/n0XjsAAAAASUVORK5CYII='],
      ['Administração Pública e Social', 'data:image/png;base64,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'],
      ['Agronomia', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFiklEQVR4nO2ZW2xVRRSGP7VitWiL8daK1iikiBHEKBaqDwpRQUQf8MHgg0HirahRClV8MJKYqFG5qFGqgQSiqdRbokgMeEFjvGuCSsEImKigxlspaktbjlnNP2Q67r3PPj2nPSb2TybZM3vNzP7PrNusA0MYwhD+lxgGPAjsBjJ5tG7gM+DCYhG5P08CYfsbGF0MIrv0AbV5rnMwsEZrPUwRkFErBGq11jb+A0Te7Ic6tQMXAYcAv2qsOo9vKtFaeRHpr22YWhla1J+bwzccBFwFvAr8APQAW6WueRNJi9GS360Pul7951LOH5GgBRWDScSwU3PGAafo+ZcUv6i9f1vye4CHgJeLSWSF5jSo/7X652aZN1tyvwGnA5d7+2/N1U4KQWSW5ryu/uPqL8oyz+RNrjHoP5qrfRSKyAhF9r+AUuBKrfFWlnnOw41Xv039CTnuH/nh/Y0rH2jeVKAc6AI6gbIY+VJvr+Mj+kUjsljzLOUxvKf+9Bj5isCoK/pr5HEfnm+u9YnWuUf9JcUi8m6eRFz8mKz+l8UiUihYmvGH1h5ZLCLlwAXAHGCB3ON18vNjclj7Ra197WASOQq4FXhHrjRJfb5VEDwvy9o3Sf6ZwSTSFnzsd0ofmoFVwDpgM/BnILcBqItZe1QBnEcmaBZ7VgPH+hvVBUI7gPlKF+JwODATWKnbYEbZ6gO6Nod4bQDIZID1boPpClo2+CNwjQw0F1Tr1+nROh8BxzCwGOclmb2Yo4FXgOM8wZOAeWLcCuxVa9WvWx/hhS4Bftd6nwNHDyCRudpnkz9Y5T2fCDyVwtAzOsmmYH4NsF3vP4xRs0JgU9LFbaaOKqP86FngahlrmVqNxpol4xzEjICMO5n7BoBENbBftmkhog9u8XR8rS5G2XAq8IJn6KZuDpdqrDuFe84Vi4Lsoc9J9IilxZBc0aAP7glOZk3oWQqEVq3r79VrE06dbstj8QZPzSo1ZqfaoR/IvEwhcI72+Sn0rk/rxUsJkyeomHBDlsuOUzOL9g6rNPYYhcEyrbeUwMWaSuzTcxSBj2NS9ChCp8kBdOmkDVcUsFhXAfys9c72X8zToNWgQkxUwc3efwM8qV/audZ2HXOItXp/s/pH6OprYyfnQeJM4H2tY2WjyLTB3KmPElUvMlK9w7x3pUpL7N2WiAqHq4hYkc1hcwFTkp3yln2wTS/N7/uY4p2ET8In407GSqQ+ajRunsVhfYFItMfcaQ54K/swH/M1buqUrYZlsj6ODHMgz6HcHcgu1biVR8fq7tOivuV9zwPnq7qyK+nK7IiUxRBZkYLIHSmIWA72aVCoG6u40yn9v0tuOjwFG7tTzmWfnNO/LnXODkKdm6rx7RGnhcZ25KBaUVguuWXKAvYr5ixQHLK2UETt3cVy4TbnkXCxdQnG7uxnZUDGN/bWiJR/tpdNJ2GL5Cx9eUPPRiJEo3dxq40rZNQnXEHr9Atl9Os3qbmTsIRtUoL7tettEvZKrtxz85URclWeqlZEqG0vRip4xQXEyZ76+a01hsQoLyD6qX2SfQ73nisTiLTF2N8BNOmleYgolMgd3642JaE67qolT5AdX0l2oqdaCxNUa6OnWl8Qw9gVHPw0vL9Jo9WwTkghv8Qz9sv03CEyVWqN3p1nmqrziX+yzpAr7PFSi1xJdKvZhmlwhuQ7FCcWJwTCe4GzRKpbrjsW9d7FqjnGZqJswqlTdwoDj3PBVnIar0LIRtnAHj1PE4nvo7LepJNxatapysgsXS1LZZhj5GJb5CScOqU9CR+Hyq06tVouOxiuNknq5NRrg+akQqWitisRJbUuGXYam4jDMBHozrKPnURqEj7sPmGqYkHTgpf5emv2bJntjSlcbC4wm7GIbR7J7WXPZtiJNvEPf2jh3L6xD9wAAAAASUVORK5CYII='],
      ['Arquitetura e Urbanismo', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB0ElEQVR4nO2Zu0oDQRSGP0GrqK2XR/ARVFDsvFVqK5ZirUGsRHwJIc+gYq+CQcVCA6m1ThrxitjIyMC/MMiuurq7mYT5YIs5Z86Z88+ZXUIGAp3DPHACPAPmn4/NcQzMFC1iN4Pik56dokTMacF3YB0YAkrABHAo3wewEBO7JJ+dc6CYknJsKKf1zRYh5FSLWRFxbMr/AAw49kHgUb5yQmxZfnvMcudFi9ldtFSBe6AC9Mt2pDnbTtyO0wk0t6JYm8My7LwzufOqxaLdrjrne0+2KY2vnbgb2SY13nPizpyuGW1W7pxrsVXHNiJbU+O+b17mXs1pamxjI9ZkizqUKyta7EkvdEmfzajQiMsYEReOP7JNK8eiclrbchFCunTOk3b8tyTF72uNQugBtoA74A2o/UNITTlu9cXrzrHuVIVFXOl4JY3TCi+Mr4WlHXtDEOIbJhwtzzChI55hQkc8w4SOeIYJHfEMEzriGSZ0xDNM6IhnmNARzzCd2pGq859u3LhthPxEEJIX7rXCXx97edRyshBiL1W9YEwFNVLENBQzikeMq6h6ipi6YuwmtJzzDI6VKfKWKomsRLT8U2wyKiAIyYqOOVrVDEW4v8MCtDufs6LZcSaAru8AAAAASUVORK5CYII='],
      ['Arquivologia', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADxUlEQVR4nMWae2iNYRzHv7syE5kUay7JkNVEyKUJ5RrhD3fFSqTN7Y/llsUfmMtfbuWSYeUPknJZY0muYTSFuUSmMBkzNIzN9NP31NPazjnv+/yec771tp1znvfze5/z/N7f5XkP4F2JAJ4BaHJ03ECEJBN56nAi1xFh9aDhJwqsK2SNRhQUC+AngG8KrMAKpyFKquEFxFty3pOTgiitSCOArwqsh5xIX0RB/Wj8pQKrmKxpiIJW0nihAms9WfsRYcUAuE/jcxV4mWR9ANAOEdR0Gn4HIEmJeZvMPERIbY3MnqvIHUfmFwCpiIB20KBEmgRl9kWyz8GxhgL4Q2PZDvjdGc6FvwAOa6xHRk10yJGdZeRXAejgwsAWI7LI3zcOI+Id2tilDe8FoJ6ZPIvRSgwNgBsNo616Jl41HeSFH+frQr5eA3c6ShtntYCp/GYajFpoPo2UwJ26sbqWlemvAVzHiz5lvNeFBn4oJsSWdFirdIkxkt+kZp894PsT4U4DaaPatlXIMEqRuGafbTfCZIHW8regCtoZDwstJ6Sohc/6sM01++1bAJYox/9tZG+1gZwkZGmQMSMBHGHLG5hQHYATAMbQPTUK1Ms2kDJChoQxNhnAIgDXAPw1JvUKQL5FP55muLBvVRLS0+N56XSFt8aEaljmeFUCv5jfNqtbx4vw0+xMMW7U5uHbq2rJ6OgXEKh0pQcJV1JSnDcm8BzAVNiplqzOfgHfCegaxtgUhuF6w5XW+nQnU3FMvk02ybeKgGA5Qvx2lbHHJau4z+bba6ZO5DbY3CPlhAwPMibLcKMyJlFN9SZbAodvXSBEYnlrkvunlOMkl0yArkaQfdcGspOQTSHGxbNjDLiWdHnaHWOhDWQOIafDGCv+u9lwswKFrC46QN4KWCidkBcezlnM5CXnHVPYablJlpRCvhXDGN7ocad8shG6i7nh7UeJ5EjEag9LlfCC5nk8b6zhZtLt2WzalUNBOYRJNetFG3jeJQvbu8mQe89aaSzaqltorlpTkrFtJCvjVxVkDIaS7nlsa3MVYn8mGZVK0e+/8jxUsBKlXnP8DAube8gQ91KT7Jr8YkEo/wfTQuNpr99o1QbAZ7q0+uO4Il7gxhDj8n1GOVPZGu1tqJrnY4hGK95ymzPW2IKaCUe6SgOrXRkAMJs2Hlu4ZkiNMlbFd9sZYjUraGMWHKvUKAq1lWM8DXO2GgFlsFSXY5AiV9rpGoUk6kl7jYQXbrYPpTMKuy2elcxfPDQpH5/C3OhQlfwkydwmtT3kWYjvcPsPrZVyr0C68cYAAAAASUVORK5CYII='],
      ['Artes Visuais', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2WQQ4CIQxF/yWcxJ23MR6EDRlv50l04VF0NXVTkgaBGZhW1MxL2FH60hYCsLHxDhmv3xEILA7UOocaE6qdS98mQL1bQL0FluB5lTATcAAmXmcLAcoEyrsdBEr33UxgAjCKSqgLpPAieUyQ8FYCTpR8rJgJtRa4maHLCarOgO/ZgtQQhndADuGQ2a8uQJlreIsknlZPsYt6vgNw5Zg7gD3vOwJ41AhQxYcifooHrkBciZOVQIpcJcyghODHJKhQJdmOi2YyyVybBk5+wEqokKj141JF60CqQj2T4+94Aa/g9kOHdEuuAAAAAElFTkSuQmCC'],
      ['Desenvolvimento rural', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbElEQVR4nO2TMWrDQBBFfyGBT2CcdL5FuoCqkFzG9n3cifS5hiFV0iWHiFWl0oQNY1i8mvWuHfDsZh58JL7E7J8ZCTD+Hx2rmADdxPsNgDdWc+G53TkDiQXICbwBQCx377NkpdRpzhjIL2shQErgFXu3AAYAI2tg78ALSzp3neBHuQGwFwKsEgJ/AVgAeOb3ehax53j06jwJ5+7Zk/yT9EKABYdMCbzj6+CFGdh7APDhNfIJYCac20fuo9x7WzgOsMsMfPxZHj6/b76+sog/salzx4jvsoq8RwLkBnZqPb/1fBfkjjUm1NlM+C6ryKkAuYGl+lvP2ybUaRPrBwflNphbZ+558wvqiPxVwWv5dTVChSqgmkYMbVChCqjqHyHhYSm+2mBkjUDXhMk2Al0TJtsIdE2YbCPQNWGyjUDXhMk2ggo2QoUqoJpGDG1QoQqo6h8h4WEpvtpgZI1A14TJNoLKNkKFSKSaRgxcmR85DtbxzEN+mgAAAABJRU5ErkJggg=='],
      ['Biblioteconomia', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACC0lEQVR4nO2YMUscURDHfxEJkQQC1wVNETABhZBGa5uUtgE/gEltZ+MHuPTnB7DUwyqmEDs3lkKKkA9gE5AEo2IRCPfCHv+Fx+P23ru9NfsW3g+Gg7mZeTM7M7d7CwkvM8AG8F2yIV2reAucA8aRb8A74AGRswacWYlfAO8lF5b+TLbR8Ro4sBL9CWwDc5bNQ+AD8MOyOwFWiYAlFTBQYrdAF3g6xuexirxyCnpDA7wA9oC/SuQO+Ah0LJsFoA/cSA6Bl9b3HfncKUYea0+x751nQA/4o8Pzz13pcYr4NWLZc938iJi7TszeiJi10NHIhF69vuw+KfFcjqTbn6DLXafLlXkC7AC/FXygEVn2+N3I3r76z6XLY41jWWcMLPsd5TIxj4At4NIai2NgJdD/Wj4LFQopWNGZxfmXyinPzcsssFnDb/6hfI9UTC6fpcvHbtp706ZyLeWL5fAVWKcar3QvGbXsixVjriunIlY2zrgwquO5aF6LfS3pT1GE+/xW5FmK1yASTGghbZFSsgiSM4FySiBlVbv6puyCCW1rU3bBZIFtbcpuImIZI1O1G00naFIhJaSOkEZrSNqRMtKOkHZkSNqRMtKOkHZkSNqRMtKOkHakvh2xX0/GKllIIaYl4mXq/8f3jPHl545UrBjfiNXy2uU/kPkueOydcPEW0jZp9Qts04IVSCSIiX83RhTwXIRN7QAAAABJRU5ErkJggg=='],
      ['Biomedicina', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/klEQVR4nO2Xu0rEQBSGPwtvhZfCFS+NlzcQC+208NIo6mOoLyKiID6D+ATeRSvFQmzWQitRQRt3CwVBFCIDJzAEZCdxzm6U+SAkG5L/3z/nzGQCgUDumAYegcjT9iCaVefBYwg7TNWJzfOq50wI8gOhIr/l3wz2ac9hajb9+urtmo0NQx0wAqx5DGK0jGbVGAeuE21x8gu904RWERhDmVngQwyfrKdoKpQVc+8osA48i7bxmEGJXuBdjFaAZgWPZmBVPIxXj4IHm2KwhT7b4rWhIX4v4kPoMyxedxriXyLeiD5N4vWpIR7VaPPOvwtSLaIQRPEJ9QNTsv+TFSkAx4mePwI6lPycSCvcKesmc08J2AHK8vtAwc+ZNMJ2CLPvspY5JTnf59EvFa7CBStEHMQEi9mT8xOe/FLjKnxsBSgmwnRb7ZXrigzKNS/STskWi4/3PfllwkV4Sq7Ztc7ZYeJABU9+mXARHrBmKTOwkXZKtpgvv0y4Ch/KdWWpTDlDiFwE6ZD3hP0S3Hdsp1wFiTGz0qTD7OTLz5mw+s1IFD6sKhC+EDMShcFegVd5Qi3o0yZextM7FyI+hz4L4nWuIb4s4jdAO3q0A7fitahh0ABcWWHmgVaP+kZrwQpxCdSjRI8VRnO7lFWzKqYyS9K/bx7/vNE6k3ZSq0QgQDq+Aax7zewhlRDLAAAAAElFTkSuQmCC'],
      ['Ciência da computação', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxElEQVR4nO2YMQ6DQAwE93mg/Door6Az+cdGiigQjS8B5+ywI7mj8MrjAw4QQnzKAwCT19QShEXKpfnBTvDyQQYAS0eFDHj3cHgilmAf7IwgvXeG3/ajIEFQE4F2JARKLUitECi1ILVCoNSC1AqBUgtSK7da9i+/ukPnMHbW5UM2qCBVJzInWG46NV8qCLXsv4FVTq0bgOd6cT5GBDnqdSvL7mWoIOys1rhOZf9pUm5HPBSk/ESYvFymBE3SqbsfQwiBDS8BUICYq1snJAAAAABJRU5ErkJggg=='],
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