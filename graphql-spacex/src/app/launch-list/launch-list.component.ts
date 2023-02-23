import { Component } from '@angular/core';
import { map } from 'rxjs';
import { PastLaunchesListGQL } from '../services/spacexGraphql.service';

@Component({
  selector: 'app-launch-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.sass'],
})
export class LaunchListComponent {
  constructor(private pastLaunchesService: PastLaunchesListGQL) {}

  pastLaunches$ = this.pastLaunchesService
    .fetch({
      limit: 100,
    })
    .pipe(map((result) => result.data.launchesPast));

  ngOnInit(): void {}
}
