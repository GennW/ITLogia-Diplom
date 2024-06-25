import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArrayUtilsService {
  constructor() {}

  // metod для перемешивания элементов массива
  shuffle(array: any[]): any[] {
    // Создаем копию исходного массива
    const newArray = array.slice();

    // Используем алгоритм Фишера-Йетса для перемешивания элементов массива
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    console.log('алгоритм Фишера-Йетса');
    return newArray;
  }
}
