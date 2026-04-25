import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cronograma Mestrado — S. cumini Nanoformulação Neuroprotetora</title>
        <meta name="description" content="Cronograma interativo do projeto de mestrado em nanobiotecnologia com Syzygium cumini para qualificação em Agosto/2026" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'&gt;&lt;text y='.9em' font-size='90'&gt;🌿&lt;/text&gt;&lt;/svg&gt;" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  )
})
