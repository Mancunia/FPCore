import xml2json from 'xml2json';

const toJson = async(xml: string): Promise<object> => {

  return await JSON.parse(xml2json.toJson(xml));
}

export default toJson