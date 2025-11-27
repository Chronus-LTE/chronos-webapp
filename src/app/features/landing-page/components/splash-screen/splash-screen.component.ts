import { Component, OnInit, Inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(@Inject(LoadingService) private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
  }
}
