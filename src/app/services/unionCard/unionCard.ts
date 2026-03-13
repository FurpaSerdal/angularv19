import { Injectable } from "@angular/core";
import { BaseApiService } from "../shared/base-api.service";
import { map, Observable } from "rxjs";
import { UnionCard } from "../../models/union-card.model";

type UnionCardApiModel = Partial<UnionCard> & {
  Id?: number;
  CheckNo?: string;
  CheckDueDate?: string;
  CheckState?: boolean;
};

@Injectable({
  providedIn: "root",
})
export class UnionCardService extends BaseApiService {
  getUnionCard(taskId: number, checkNo: string): Observable<UnionCard | null> {
    return this.http
      .get<UnionCardApiModel>(
        this.apiUrl + "/birlikkart/" + taskId + "/ayrinti/" + encodeURIComponent(checkNo)
      )
      .pipe(
        map((card) => {
          if (!card) {
            return null;
          }

          return {
            id: card.id ?? card.Id ?? 0,
            checkNo: card.checkNo ?? card.CheckNo ?? "",
            checkDueDate: card.checkDueDate ?? card.CheckDueDate ?? "",
            checkState: card.checkState ?? card.CheckState ?? false,
          };
        })
      );
  }
  tarihUzat(taskId: number, checkNo: string): Observable<void> {
    return this.http.post<void>(
      this.apiUrl + "/birlikkart/" + taskId + "/güncelle/",
      {
        checkNo: checkNo
      }
    );
  }
}