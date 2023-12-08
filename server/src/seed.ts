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
      ['Educação', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEElEQVR4nO2aTWxVRRTHf62VPlIivge1usBYFkYD0ULcuJWoVFIp7lB0YVDcFLSQ6EZo2FnZiGnC0rhwyaKIiEYE/Ij4ARoTsJSyQYhBLHFh+eaZE/+TnFzuu+/e19t3G8M/meTeO2fOnJk558yZMxdu4/+LCtAPvAvsBX4DJoErKvZ8QnVGsxooM0tQAl4EPgNuANWM5TqwH1gHtBcxgLnAZuCcE+oycAB4WyvzsGb8TpWyvlndVuBLtQntzwKDmpymYBUw4QT4AVgPzG+A193AK8CPjt8poJcZhM3ULtfhT8BTOfJfCRxz/EdmYnXuleDWwT/AAHBH3p3wH89NwJRb7a68mHdruavyOkuZeTwCjKnPcckwLXQ6ht8DC2keysDX6ntCWtEQSk6dvgU6aD46gO+cmjVkM7ucOtlmVxQWOK0wB5DZxQbDboZNpLGZKclk3i31Zhf2CfNOswWvO+NPpWJb3D4xHRc7TxNxUmVA3xpFG/CzZLNBJaJdoYIRP9lgh+ZdhoC/YmKrv4H3gPsb5P2M+JyrtyrrnIfIiseAj4CrTvDDwBqVw+77VdFamyxocZ70+STCz0VksVMatAJ9rl1VUfAe4PEY+mXAh5HBWpz1klQnDTao3b5aBBWF1ZdTBIBB/8OOb+Ui8A6wKIUwi0R7MRIsDqSwo7LON9dqyblGDL/IqP/m4d5UJJsVJvSr2quy2NEh0Zo23IIdqrTzRBb9N/WaLloz2tGQaIbjmO1V5bMN6n9eWJbCjoL2jMYxOKlKO8XhArag/8Mx+m/vazVDHwAHtWGd1hl90vEI76fV10G1GRKPON5RO/pKdUv0bnmBW3BBlRbbGL5xDLbK9QU8pGPtzQbO6bWK8Tog3gEtUvVAYzKhKNze/4wbyBVVznGhyogT1pIE96lu3J3TLfGwHXgZeAJ4UOeHciRLEt67RbNCbbaLRzi/22oFx/KpG+SIZAobd+i/7kAC+tyMnI+830V+MF6Bb5/68n16JA4kqloeURUIz3mjGunDa4FHompFjT2ug8FICmeu1MkCzffl0X7V3nJexn1TZVLfJkSzR222iIfxCnytjzcidumRaOwfq3J1wkAMj7r3Szkau+dlfSQh0f3ucB4qaSBE9hVL4exU9sMmoQdYrPN+WbPaoudO1fWIdpPaHotkKushcUPsV6VlAKOIdnC8xkCMx3IJ2yXhW1XK+rZYNP01BnK87jDqhChlFzT6uGmFG4g9I2F2O0+XRzFeu8U7CRUXNNb0mvvF1NKYAT7CtWcPY/S08sA7pbO/yKD/kIHfUJnUtwnRjKrNZvFI68pfkyyfJBG94GKbqDfzm1VRaAGOShYLa2qi5I66NkuGt9xA7LlIrJIcZ9JcQwyK+KiSDx1qeKagJF1Am1TSZNtICpScXZhXQR7GSpEYlExjWS6FetVoSsmxotHjNszMVxkjbgbi4q9modNF2+blMqOktFBVieQi7GMecEQyHJnOPWOnArNwrWDvzULFHe5O5XHh0+2WdixFQJeXTYy7veuBvBh3OTWbUu41bUItC9rknS45dbon705KzgFUlVDuzXHHts0u7BPBsGf07n2lW/aqcrEbGvyLoaLYKYQdValSnrfFdVfH1Ov3SPRq4fU2HXyWyG3PUVmgS6PnRHMoEj1b5LCxqD8g2pUV36cjQNbQ/ZoSg2uLGkAc5uugM6zz+AklNMJPNRd0aBoVTV/OWZjbYDbhXxK1LJe5B/MJAAAAAElFTkSuQmCC'],
      ['Educação Especial', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIiUlEQVR4nO1ca4gVZRh+PLO5RqamRhe1aFvJLdrVNTdTQU3tT6EUZZYVWF7zFv0oQsNMLS9kJFimiWlZFildfvSjMstMQ1MwIdPWe6ulbitJru7qxgvPwMvHnDlzZr45e/Y0Dwxn+Ga+2zvf996/AyRIkCBBggQJEiQIiW4ARgF4GcBHAHYBqAZQC+A8r1qW7QSwDsBs1umK/yEcAPcAWA5gP4CmiNc+AG8DGAoghQLGDQDmAzhmEEBW16cA5gAYDeAOADcBuApAa15yX8Jno/nuZ6yr2zrKPmRVFwy6A1jJrehOdC+AmQAqI64aWc29AbwI4DfVvvS1AkApWjCuBLAYQAMnJb9rAPSNsc+7ALyn+rwAYBGAtmhhuF9tVZnMMm7LdJBVOA5AD6N8C4DNRlkPvuu3ckvIYxvU1h6BFoA2AJaqrfQDgPIA9ar4/idGuRDve6NsA9/tE6DdCn4EdzxLABQjj4XETg70HIBJAFql4YkHAUw0eNk0ALcH6Ec+yFTWcfE0gANpeJ6MYTLHJGPbkY/qz63cJk1k5vLl/Qggk3nBYv8zAPyb4QP0pMojYzwMoAx5gioApzmwjQDaGc8HAxhklOnVYwtOgH7bA/iWYz0VkA3EvvJOKf7lxV/OAKhrhrGl61f49HpFxLLm5HlHFfHSraqRAB7K8dgy9esoYXS4OXhiGyUwNhorT+6LkH8oMsYpc9jEOWzPtXReqgRGO2NQx0nUfIPwvhqDUO2VPS4qTs6UZFdVqfD4yt+QwPmGtwB87cFqegGo55yG58I8cy2MSSgcTOGcjsRt9i1WFkYrFA7ELPyRc1sYVyfdaVs2GObZYKoMIvVaCh7mmAcZW7mRDoib4+h0Jb+QOAY0BlHfag5VJSxGcswDjfIVnKM4IqyiG31sjS3dx5YBJdxhF6jnWsN8fhnx5xU63udcX7HVoKMkb1+DJ5YjHvTlNjrOa3mMjtgKzsVFPyWRrcRYhik3vMZBekBsWR1XA3gWwB6fANIeviPv2kAR9VlxhblopZTrITY6Wc7GJIahMdGCS0pW97007nXMRFbdAgC38FrAMh3zWM+6jgVX2ASjbBb7EeU7Mn5nYyLmbQql57mKXaKIgPqK0vwyjzoOQ5cfk8m79WrIo20Kt6o0uy7URKWhvy186TYkjhDpkiKA2NMvZSn1rgUwHcBuY4uLt3k8gCsijtXhnJuiemoeYSMSt3WR4hdyArbRh1uhTk30LIBVAAZEGRz51QC2dVa1X8c+gzpMHc5JC43P2ZYo3aExm41I2oWLcSyb6lOvc5oVshXAWNrUttGOY9tq9LmbY5ExpcN0vvuUKpvLMtkdobGOjUg2gA4rrveJPzyjvBty/QngNXqvc4Xb2Odfahz1JJQXyjknEVguHme9D6IMxHWaZhM7OMs6p0l4Sc3ww+UUDs8BWM0VJIlEJznpet5X89m7fHcI6/qhNcfgxmz+yWIedyq+GhqulLwxizq/qK9+hhMeZvDMFCf2pQo3hrnOsY1HDf7lkMCrDN4rYwuKm1hH64hZww0YdcqiTjH54zZjsjV0h/VWjgm5LtKl/jr5Y3/apJ3ZVjHvS/hsHN/dwbpuO+8w10a27h9G39s4pmzc9p1ZV1Z/aLjKbesM6RbpoFUVrxU0PsuPY6IT2/Bqex8FgDbT/GDOq1jxTqsE9Eq3SAd3MqCa8AaAE0a5DbjtnWAfwr+yhTkvKwQMs4U1vAjlxEhAm9FAK1v4UAghopGOUHER0CZcISLSPzR+DqHGZEPAjgAeoPG+hnyomgKnlvZxI+9r+GwL353Fuh1jIqCrxoiAi6xIP6bKyhjVL7dAwMYIKoxXG1F8ghuM/MQnbCjSXqbc2ACmXFACNjDgLWbTGMYoJKBzHfOiHV5yfz09LgP57lzWbbBAwGk+ppys9NAYxUYkodtFilvaCVA/3cT2+RCwlMQyCdiFzySI9aQHAUVVCguHc9LK+Bdsd6QNd1ZtCHfWHEVAudfoTgtCK8Jhr4tsK6i+FwRFyoKRDxcJ7moRCyIb1KpJii3qhWsAPMhtspq6WDVjMKYQOcZnm/nuLNaVNhCTAInsUAUPsTTxKAGMtNoZPvV2KQLKfb5ippFurHn/mzY6GJqGxxzIEFQaowgo9/mIIs6h2nDSumEMybqIjJRKpJRzGC5KM+Qky+B+5ZWP+YIuyo14Sn+VeJmyHViXQyzZYHguUsYsYy3nOi+O1I4GupUKFaUUWvU2pC8CJt4MLpDsLL8EKmtf5wJXoZy5KLTsrEquvvMZjqVFwiJ+oZ8K7GxuSkXzXo2zo7ZKIk9G4WCakrxRg/IZMUIFdHoaz4pon1rJKbGMZTw9YJqklRQaki1xX64Gs0TFHdob6Rs1zNTPN2xksEkHljoopVkCVTlDMaNiTVxxbYxncZyFiwrHiO3ImL9TPD1T/No6upJnNDGq7/ioDM2h4vj1q496HaL7rFlQpgJP642VmM+HDTeogJFO52gW9FFE3ES+AkNPNLPh47CNiwL020Ft25P8F5C8QJnazvszJGNWUIL7ucLCuKTOZYjTVCqBcSgfVp4XT9yugtFT0ijb3ekKm2DwpOkBA1UV1Ns0z51Il5RXlmqK79crgdFsPC8TipWK00TtvleEP53wSiPJ5k8nKlWOziWqKjmXtmEwXFksjUz88Ts+lWJEzNxWXmkkPfiunylZSseAG/I8nEsl2abZt1AlhDfwEEu/mA4qtqIzdK0i3HnatrGbZ3GihC4wfYxhP4NC2eRae8FhAGi2EhAuD870Zz8tDl15fOqIEZasY0L3PKbVVpHoHdWfj3VkWRUzBuaxzhmjrcN8Zt0Zmk9IAbibDoe9FuLCexk9G1xgLrbA6EKzS5IhP6QqVM1YsvsHjKdZtp25KrNYJ2/VkQQJEiRIkCBBAuQ3/gNgihcNigWrvQAAAABJRU5ErkJggg=='],
      ['Enfermagem', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACMUlEQVR4nO2XPYtTQRSGHzUIooVYxcButdjbiWIpwiaC1WKxjZ0/YDdWNrviR2OjpdhtaSdWRrBxV6M/QEgbixWF3Yi4wnJk4FWuw829yc1NMhPzwsCZM3Mm8+TM3JmBOPQGaDMDMpXoZaGCXAc+JyY4aAlO3QIQRoAadmI2B5m1jDSAFvAd6MmujzLgNEDuZmy6zaKDehMb+2ZvKPAnsAacVVmXz0bMzMRAXivQQfhqqq1VAsi4+v/VvgJdFnzV1Ob6FFVyYu+BnRzbYgB5B2zn2FYUpKVAtyd83Y5padUTm72pLNQEcVDiZh/70kKf2HF/fktdWseBh7qNusvcffnQv97SYRj8gfgg5R+/N9o8p7O0uup0Ebgk2/mcKgL9Jv8h0AGeAguhLS3zOiXradn6U9z960IJIKX1twyQr7JdppyOAueALfl3gVNM5mHVHQXkh+zTXsyRxFlzq+BTdxiYrmIKg7yVfSUl7obaXhKILAPkkew7KXFVte0BxwgcZEX2iz6xHbWfJ3CQRdlftC98PSuwacsovbTDOQuExKZcSgG5OSUQS5SNQUGeq76aArKU0n8SqnkX2OVBQNZVf9xn0GmA+E+KV4OAXFa9HSBINfnIywM5AfxScXZIIP/8fh6I0wfvqhItyBP5mlkDxQByTb5PwMl+A8UAUgE+yu/uX1eBMxn9gwKxyAozCxKbbA4SmGyekcBksX+1/j+QUGVzkNgyYn3WYGiyvCtK1CC/AU4IwHiYmkfSAAAAAElFTkSuQmCC'],
      ['Estatística', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABAklEQVR4nO2WPWoCQRiGH4iQGwxomS6NfcyF7KxiSs8QRA8SmwQFOz2AkFKPsZ0TFt6FQXc2E3Z2UJgHPli+n3e++dnZhcyd8yNLziPwDljZm3ytsIntiu+Eg3/5VmGeYPCPpm0YNC1RSyrdfmhibIJ1bW6A5qV6AF5l5fMlBtgCwy62wAB7J2cnnxs/KLaN3YBxxI/ASc8Hxdx45YvWgKkRd32nmoZCJxaUuPGIG22Db0v+0g1OfAbWHvHyII6AF8+hbNKtJd8DNt+E3MjHyKb6EwphpuIzsNBr2XPiPfmWyrGqicITUEh4HJA/Vm6h2tasNKPpP2omqvmM0UAmQ5f8Amzp2PVatLcMAAAAAElFTkSuQmCC'],
      ['Filosofia', 'data:image/png;base64,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'],
      ['Geografia', 'data:image/png;base64,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'],
      ['Letras', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAd0lEQVR4nO3WwQ2AIBBE0V+Y3rVtNzaChYwnjxIVN0tWJ+EIjzCQAH8CoxfGBswRsIASBasHeAXsDLTGndfmqbZOGHxkiILHno5anrfaouBax62wnnbsCpvjUatLOGXH1aR8x/pcx7oCKxNswJL6s1eA6S78B4/shJfFe0L+W/4AAAAASUVORK5CYII='],
      ['Relações Internacionais', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACC0lEQVR4nO2WTUhUURTHfyON9qGDIG1KiBJRCBcVoljM2hZuK4hAxHAREbhMN8IsZha2ERH8QFy4qfbpxgQ3bYOoGaZ2qYUFISFSThMX/gOX6X3Nm/c2MX+48Djnf86573zce6GBBoKjGbgUgHdF3MhwBpgAisB74LQHt1mcj8BDoCVMwDagF7gPrAPfgbK1ch6201XcA2ANuAt0A61egV9VGVfWH2ALmAROtAYc7LuAI/GfAtsu/sra1D/ok3ND+AAsK/WXLU5OeqdSbEi3asnMXz9WwKL0x169tCLScxe9qek7h1Lck8yU67xPhmfxwAXgp4hDLpwBZaoE3AJSwGfZjLnYpKX/AXTgg4zIOw66JDAKfLNKsaTv39pA9QgmgDfiTBEAKeCrDMwk3FCKF4F9q5FKLg22CywAd4BrwAPJ94BzBMQjjw4uaMYraTVrXrKCh51p6MBIytmx/vo1MAP0A03iPLGcV6aiSX2RkU1ePWV8nSJCXAQOFfxLgAMqcrxU0BfAdeCXNRWxY1jBTQY6JctKltfdERvOAp8UzPSA3wEVObIK8tahqWIvxVUrwKDPBiMvRUJjZZzPefBiK8W4nJozod2Ha5fiZhTBO/SwKOthEQRZ61qvuxRrcrZZg41dCrOZ0EjrhWOO5J4abSMpxTP9hXnrhUE2ioa8HfZ1qwtqpJ7gDfz/+AuVkLT5ckgaKAAAAABJRU5ErkJggg=='],
      ['Tecnologia', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACNUlEQVR4nO2ZPU4DMRCFP7GhpuSnIBWEChLRUXMFSihp4CBcglRQpCANPy0lB6CBINETpBSQQAMEWRoka7W7Sex1bIs8ycpqItnz1uN5nlmY4f+gAdwA78AbcA3UiQwbwAAYpoay1YgIbXG8BSzKaIntgojQFaeXNNuy2F6IBBUtrJTz0RGpAAdARzsTLdmVpRhCK8kg8AT0Mw57P8TDnmQQ6IitIqn2SlKvGpfAFgFhDtgDHjQCz8ChEAheyBJgP2cHEg/+GAuZTuBRSLkkYCWsRUI2TQLWwlokZIMpErAW1m6BkPWYPnqmwtouELIf4Byouvefqqz1YyqstRwhU2H1Kc/q9wRYcEBgQebW1xqYCmuWkG0Cq8CZ9pZUGB4B8yUQUHMcA68Zu+9MWLeB21QmUwJpil3gXpvvDtgpw9FpOVD2C7EOiaNUSJxJGNZFhd9l/Cly+iC/lhiipR/SD89JwxpV2ZGvAkX+1nYtePQKFNmHsBqjG3OpO+4NIdhSNws1Ea/0YX8LsdQdhXXgVCOhnteIGEMZ0WPoi0ij5OazLZFG2TV7zQORDRc1+4UHIm0XNfuLByJdFzW7afPBlEhi0wwvUmTTdtCkRBJZ49GmGZ5Xs/ctGnTjEski0LFphufVyFkLjUNoFJFR89Zd1eyTNrHziATTDE9GvEl112pq/zXFZrqzzpEX23m3Xx/N8ImQl21Uulzx3Aw3gp7/Q2mGG2NW6oaGImGNrtSth/5VdwYc4hehMJfCLXTb/wAAAABJRU5ErkJggg=='],
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
            color: category[3],
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
                icon: hobbie[1],
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