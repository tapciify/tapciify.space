export interface AsciiArt {
  asciiArt: string;
  width: number;
  height: number;
}

export interface ConvertResult {
  data: AsciiArt[];
}

export interface AsciiCharacter {
  character: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface RawAsciiArt {
  characters: AsciiCharacter[];
  width: number;
  height: number;
}

export interface RawConvertResult {
  data: RawAsciiArt[];
}

export interface APIError {
  status: number;
  message: string;
}

export class TapciifyApi {
  baseUrl: string;

  constructor(baseUrl = "https://tapciify-api.shuttleapp.rs/api/v1") {
    this.baseUrl = baseUrl;
  }

  async convert(
    file: File,
    width = 0,
    height = 0,
    asciiString = " .,:;+*?%S#@",
    fontRatio = 0.36,
    reverse = false
  ): Promise<ConvertResult> {
    const formData = new FormData();
    formData.append("blob", file, "img");

    const req = await fetch(
      `${
        this.baseUrl
      }/convert?width=${width}&height=${height}&fontRatio=${fontRatio}&asciiString=${encodeURIComponent(
        asciiString
      )}&reverse=${reverse}`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await req.json();
  }

  async convertRaw(
    file: File,
    width: number,
    height: number,
    asciiString = " .,:;+*?%S#@",
    fontRatio = 0.36,
    reverse = false
  ): Promise<RawConvertResult | APIError> {
    const formData = new FormData();
    formData.append("blob", file, "img");

    let path = `${this.baseUrl}/convert/raw?asciiString=${encodeURIComponent(
      asciiString
    )}&fontRatio=${fontRatio}&reverse=${reverse}`;

    if (width) path += `&width=${width}`;
    if (height) path += `&height=${height}`;

    const req = await fetch(path, {
      method: "POST",
      body: formData,
    });

    if (!req.ok)
      return {
        status: req.status,
        message: await req.text(),
      };

    return await req.json();
  }
}
