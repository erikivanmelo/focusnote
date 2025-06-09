// Types for colors
export interface Color {
  id: number;
  name: string;
  is_default: boolean;
}

const colorApi = {
  getAll: async (): Promise<Color[]> => {
    return window.ipcCall("color.getAll")
      .then(colors => colors)
      .catch(error => {
        console.error('Error in getAllColors:', error);
        throw error;
      });
  },

  getOne: async (id: number): Promise<Color | null> => {
    return window.ipcCall("color.getOne", {id: id})
      .then(color => color)
      .catch(error => {
        console.error(`Error in getColorById(${id}):`, error);
        throw error;
      });
  }
}

export default colorApi;
