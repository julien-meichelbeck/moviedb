/* eslint-disable import/first */

// Standard static methods
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/interval'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/never'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/range'
import 'rxjs/add/observable/timer'

// Custom static methods
import './add/observable/watchTask'

// Standard operators
import 'rxjs/add/operator/bufferCount'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/partition'
import 'rxjs/add/operator/pluck'
import 'rxjs/add/operator/publish'
import 'rxjs/add/operator/publishReplay'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/sampleTime'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/skip'
import 'rxjs/add/operator/skipUntil'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/switchMapTo'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/zip'
import 'rxjs/add/operator/takeLast'

// // Custom operators
// import './add/operator/backoffRetry'
// import './add/operator/debug'
// import './add/operator/store'
// import './add/operator/watchTask'
// import './add/operator/watchTaskCache'

// Classes
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import deriveSubject from './deriveSubject'

export { BehaviorSubject, ReplaySubject, Observable, Subject, deriveSubject }

export default {
  BehaviorSubject,
  Observable,
  Subject,
}
