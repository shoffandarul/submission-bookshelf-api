const {nanoid} = require('nanoid');
const books = require('./books');
const insertBookHandler = (request, h) => {
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const isFinished = () => pageCount === readPage;
  const finished = isFinished();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const specificBook = books.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase()));
    if (specificBook !== undefined) {
      return {
        status: 'success',
        data: {
          books: specificBook.map((b) => ({
            id: b.id, name: b.name, publisher: b.publisher,
          })),
        },
      };
    }
  } else if (reading === '1') {
    const specificBook = books.filter((b) => b.reading === true);
    if (specificBook !== undefined) {
      return {
        status: 'success',
        data: {
          books: specificBook.map((b) => ({
            id: b.id, name: b.name, publisher: b.publisher,
          })),
        },
      };
    }
  } else if (reading === '0') {
    const specificBook = books.filter((b) => b.reading === false);
    if (specificBook !== undefined) {
      return {
        status: 'success',
        data: {
          books: specificBook.map((b) => ({
            id: b.id, name: b.name, publisher: b.publisher,
          })),
        },
      };
    }
  } else if (finished === '1') {
    const specificBook = books.filter((b) => b.finished === true);
    if (specificBook !== undefined) {
      return {
        status: 'success',
        data: {
          books: specificBook.map((b) => ({
            id: b.id, name: b.name, publisher: b.publisher,
          })),
        },
      };
    }
  } else if (finished === '0') {
    const specificBook = books.filter((b) => b.finished === false);
    if (specificBook !== undefined) {
      return {
        status: 'success',
        data: {
          books: specificBook.map((b) => ({
            id: b.id, name: b.name, publisher: b.publisher,
          })),
        },
      };
    }
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((b) => ({
          id: b.id, name: b.name, publisher: b.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {insertBookHandler, getAllBookHandler, getBookByIdHandler,
  editBookByIdHandler, deleteBookByIdHandler};
