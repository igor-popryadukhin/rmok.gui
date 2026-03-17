import { getGender, incline } from 'lvovich';
import { LvovichPersonT } from 'lvovich/lib/incline';
import { DeclentionStrT } from 'lvovich/lib/inclineRules';
import Vue from 'vue';
import { FioT, GenderStrT } from 'lvovich/lib/gender';

export class Lvovich {
  /**
   * @param person
   * @param declension
   */
  public incline (person: LvovichPersonT, declension?: DeclentionStrT): LvovichPersonT {
    return incline(person, declension);
  }

  /**
   * @param fio
   */
  public getGender (fio: FioT): GenderStrT | null {
    return getGender(fio);
  }
}

const lvovich: Lvovich = new Lvovich();

// tslint:disable-next-line:max-classes-per-file
class CookiePlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $lvovich: {
        get (): Lvovich {
          return lvovich;
        }
      }
    });
  }
}

Vue.use(new CookiePlugin());
