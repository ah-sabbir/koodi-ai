//actions/getUsers.ts

'use server'

export const getModels = async (offset: number, limit: number) => {
  try {
    const payload = {
        "search":"search",
        "author":"author",
        "filter":"filter",
        "sort":"sort",
        "direction":"direction",
        "limit":limit,
        "full":"full",
        "config":"config"
    }
    const url = `https://huggingface.co/api/models`
    const response = await fetch(url)
    const data = (await response.json()) as any
    const startIndex = (offset - 1) * limit;
    // console.log(data.slice(0, 0 + 10));
    const datalist = data.slice(startIndex, startIndex + limit);
    return datalist
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}