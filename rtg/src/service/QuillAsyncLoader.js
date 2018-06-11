export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('react-quill/dist/quill.snow.css');
      resolve(require('react-quill'));
    });
  });
};
