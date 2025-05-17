const createChapter = async (data) => {
  await createChapterValidator.validateAsync(data);

  const createdChapter = await prisma.chapters.create({ data });
  return createdChapter;
};

export default { createChapter };
