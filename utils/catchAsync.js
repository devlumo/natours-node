/* 
    catchAsync removes the need for trycatch blocks in the controllers

    For async functions we wrap them in the catchAsync function
    catchAsync immediately returns a new anonymous function which runs our passed fn
    as this passed function is asynchronous we can append a .catch at the end to handle any errors
    catch then calls the next function which will push us out of the route and trigger the error handler middleware

    Now we do not need to add try and catch to every function

*/

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default catchAsync;
