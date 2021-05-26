import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { Activity } from '../../models/activity';
import { ActivityService } from '../../service/activity.service';
import { UpdateNotesDialog } from '../../ui/update-notes-dialog/update-notes-dialog.component';

@Component({
  selector: 'app-view-activity-menu',
  templateUrl: './view-activity-menu.component.html',
  styleUrls: ['./view-activity-menu.component.css']
})
export class ViewActivityMenuComponent implements OnInit {

  @Input() activity: Activity;

  constructor(private router: Router, public dialog: MatDialog, private activityService: ActivityService,
    private alertService: AlertService) { }

  ngOnInit(): void {
  }

  complete() {
    this.alertService.clear();

    if (this.activity) this.activity.status = 'COMPLETED';
    this.updateActivity();
  }

  cancel() {
    this.alertService.clear();

    if (this.activity) this.activity.status = 'CANCELLED';
    this.updateActivity();
  }

  putOnHold() {
    this.alertService.clear();

    if (this.activity) this.activity.status = 'ON_HOLD';
    this.updateActivity();
  }

  updateNotes() {
    this.alertService.clear();

    const dialogRef = this.dialog.open(UpdateNotesDialog, {
      width: '350px',
      closeOnNavigation: true,
      data: this.activity.notes
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activity.notes = result;
        this.updateActivity();
      }
    });
  }

  private updateActivity() {
    this.activityService.updateActivity(this.activity).subscribe(
      (activity: Activity) => this.handleActivityUpdate(activity),
      (err) => this.handleError(err)
    );
  }

  private handleActivityUpdate(activity: Activity) {
    //this.alertService.success("Activity successfully updated!");
  }

  private handleError(err: Error) {
    console.error(err);
    this.alertService.error("Problem updating, please contact support.");
  }
}
