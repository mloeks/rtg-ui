export default () => (
  new Promise((resolve) => {
    Promise.all([import('react-quill/dist/quill.snow.css'), import('react-quill')])
      /* eslint-disable-next-line no-unused-vars */
      .then(([a, b]) => { resolve(b.default); });
  })
);
