export default class Utils {
  private async request(method: string, url: string, payload?: any) {
    console.log(
      "process.env.NEXT_PUBLIC_BASE_URL :",
      process.env.NEXT_PUBLIC_BASE_URL
    );
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("in api response -", response);
    return response.json();
  }

  post(url: string, payload: any) {
    return this.request("POST", url, payload);
  }

  put(url: string, payload: any) {
    return this.request("PUT", url, payload);
  }

  delete(url: string) {
    return this.request("DELETE", url);
  }

  get(url: string) {
    // console.log("url" , url);
    return this.request("GET", url);
  }
  // test(){
  //   console.log("TestConsole")
  // }
}
