export default defineAppConfig({
  feedback: {
    /** Suggestions are delivered by FormSubmit (https://formsubmit.co) to this inbox. */
    email: 'dev.vicente.contato@gmail.com',
    appName: 'CineArquivo',
  },
  support: {
    /** Pix "copia e cola" payload; `public/pix-qr.svg` encodes the same string. */
    pixCode: '00020101021126580014br.gov.bcb.pix013605627795-ff05-44d4-bd76-2eee7e90230f5204000053039865802BR5916LUIZ F V PEREIRA6007PINHAIS62070503***63043BBE',
    recipient: 'Luiz F. V. Pereira',
  },
})
