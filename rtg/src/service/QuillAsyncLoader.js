export default () => (
  new Promise((resolve) => {
    Promise.all([import('react-quill/dist/quill.snow.css'), import('react-quill')])
      .then(([a, b]) => { resolve(b.default); });
  })
);
