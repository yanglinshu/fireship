import { Component } from '@angular/core';
import { LaunchDetailGQL } from '../services/spacexGraphql.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-launch-detail',
  templateUrl: './launch-detail.component.html',
  styleUrls: ['./launch-detail.component.sass'],
})
export class LaunchDetailComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly launchDetailService: LaunchDetailGQL
  ) {}

  launchDetails$ = this.route.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.launchDetailService.fetch({ id });
    }),
    map((result) => result.data.launch)
  );
}
