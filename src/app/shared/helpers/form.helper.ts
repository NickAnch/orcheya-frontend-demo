class FormHelper {
  public arrayToUnderscore(data: object[]): object[] {
    const newData = [];
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      const obj = data[key];

      if (Array.isArray(obj)) {
        newData[key] = this.arrayToUnderscore(obj);
      } else {
        newData[key] = this.objToUnderscore(obj);
      }
    }

    return newData;
  }

  public objToUnderscore(obj: object): object {
    const newObj = {};

    for (const prop in obj) {
      if (!obj.hasOwnProperty(prop)) { continue; }

      const underscored = this.toUnderscore(prop);
      newObj[underscored] = obj[prop];
    }

    return newObj;
  }

  private toUnderscore(str: string): string {
    return str.replace(/([A-Z])/g, ($1) => '_' + $1.toLowerCase());
  }

}

export const formHelper = new FormHelper();
