const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };
  //mengirimkan nilai objek ke dalam array notes

  notes.push(newNote);

  //cek apakah nilai berhasil di masukkan ke dalam array
  const isSUcces = notes.filter((note) => note.id === id).length > 0;

  if (isSUcces) {
    const response = h.response({
      status: "succes",
      message: "Catatan berhasil ditamnbahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: "succes",
  data: {
    notes,
  },
});

const getNotesByIdHandler = (request, h) => {
  const { id } = request.params;

  //filter untuk mendapatkan objek
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: "succes",
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });

  response.code(404);
  return response;
};

const editNotesByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toISOString();

  //mengubah note dengan indexing array
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: "Succes",
      message: "Catatan berhasil diperbaharui",
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "Fail",
    message: "Gagal memperbaharui Catatan. Id tidak ditemukan",
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  //mendapatkan index dari objek
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      status: "succes",
      message: "Catatan berhasil dihapus",
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "Fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotesByIdHandler,
  editNotesByIdHandler,
  deleteNoteByIdHandler,
};
