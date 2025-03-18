(()=>{"use strict";var e={"./server/src/app/app.module.ts":(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AppModule=void 0;const s=r("tslib"),i=r("@nestjs/common"),o=r("./server/src/users/users.module.ts"),n=r("./server/src/tickets/tickets.module.ts");let a=class AppModule{};a=s.__decorate([(0,i.Module)({imports:[o.UsersModule,n.TicketsModule]})],a),t.AppModule=a},"./server/src/tickets/tickets.controller.ts":(e,t,r)=>{var s;Object.defineProperty(t,"__esModule",{value:!0}),t.TicketsController=void 0;const i=r("tslib"),o=r("@nestjs/common"),n=r("./server/src/utils/random-delay.ts"),a=r("./server/src/tickets/tickets.service.ts");let c=class TicketsController{constructor(e){this.ticketsService=e}getTickets(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();const t=void 0!==e?"true"===e:void 0;return this.ticketsService.tickets(t)}))}getTicket(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();const t=yield this.ticketsService.ticket(Number(e));if(t)return t;throw new o.NotFoundException}))}createTicket(e){return i.__awaiter(this,void 0,void 0,(function*(){return yield(0,n.randomDelay)(),this.ticketsService.newTicket(e)}))}assignTicket(e,t){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();const r=yield this.ticketsService.assign(Number(e),Number(t));if(!r)throw new o.UnprocessableEntityException;return r}))}unassignTicket(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();if(!(yield this.ticketsService.unassign(Number(e))))throw new o.UnprocessableEntityException}))}markAsComplete(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();if(!(yield this.ticketsService.complete(Number(e),!0)))throw new o.UnprocessableEntityException}))}markAsIncomplete(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();if(!(yield this.ticketsService.complete(Number(e),!1)))throw new o.UnprocessableEntityException}))}};i.__decorate([(0,o.Get)(),i.__param(0,(0,o.Query)("completed")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"getTickets",null),i.__decorate([(0,o.Get)(":id"),i.__param(0,(0,o.Param)("id")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"getTicket",null),i.__decorate([(0,o.Post)(),i.__param(0,(0,o.Body)()),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[Object]),i.__metadata("design:returntype",Promise)],c.prototype,"createTicket",null),i.__decorate([(0,o.Put)(":ticketId/assign/:userId"),(0,o.HttpCode)(204),i.__param(0,(0,o.Param)("ticketId")),i.__param(1,(0,o.Param)("userId")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String,String]),i.__metadata("design:returntype",Promise)],c.prototype,"assignTicket",null),i.__decorate([(0,o.Put)(":ticketId/unassign"),(0,o.HttpCode)(204),i.__param(0,(0,o.Param)("ticketId")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"unassignTicket",null),i.__decorate([(0,o.Put)(":id/complete"),(0,o.HttpCode)(204),i.__param(0,(0,o.Param)("id")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"markAsComplete",null),i.__decorate([(0,o.Delete)(":id/complete"),(0,o.HttpCode)(204),i.__param(0,(0,o.Param)("id")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"markAsIncomplete",null),c=i.__decorate([(0,o.Controller)("tickets"),i.__metadata("design:paramtypes",["function"==typeof(s=void 0!==a.TicketsService&&a.TicketsService)?s:Object])],c),t.TicketsController=c},"./server/src/tickets/tickets.module.ts":(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.TicketsModule=void 0;const s=r("tslib"),i=r("@nestjs/common"),o=r("./server/src/tickets/tickets.service.ts"),n=r("./server/src/users/users.module.ts"),a=r("./server/src/tickets/tickets.controller.ts");let c=class TicketsModule{};c=s.__decorate([(0,i.Module)({imports:[n.UsersModule],controllers:[a.TicketsController],providers:[o.TicketsService]})],c),t.TicketsModule=c},"./server/src/tickets/tickets.service.ts":(e,t,r)=>{var s;Object.defineProperty(t,"__esModule",{value:!0}),t.TicketsService=void 0;const i=r("tslib"),o=r("@nestjs/common"),n=r("./server/src/users/users.service.ts");let a=class TicketsService{constructor(e){this.usersService=e,this.storedTickets=[{id:1,description:"Install a monitor arm",assigneeId:1,completed:!1},{id:2,description:"Move the desk to the new location",assigneeId:1,completed:!1}],this.nextId=3}tickets(e){return i.__awaiter(this,void 0,void 0,(function*(){return void 0===e?this.storedTickets:this.storedTickets.filter((t=>t.completed===e))}))}ticket(e){var t;return i.__awaiter(this,void 0,void 0,(function*(){return null!==(t=this.storedTickets.find((t=>t.id===e)))&&void 0!==t?t:null}))}newTicket(e){return i.__awaiter(this,void 0,void 0,(function*(){const t={id:this.nextId++,description:e.description,assigneeId:null,completed:!1};return this.storedTickets.push(t),t}))}assign(e,t){return i.__awaiter(this,void 0,void 0,(function*(){const r=yield this.ticket(e),s=yield this.usersService.user(t);return!(!r||!s)&&(r.assigneeId=+t,!0)}))}unassign(e){return i.__awaiter(this,void 0,void 0,(function*(){const t=yield this.ticket(e);return!!t&&(t.assigneeId=null,!0)}))}complete(e,t){return i.__awaiter(this,void 0,void 0,(function*(){const r=yield this.ticket(e);return!!r&&(r.completed=t,!0)}))}};a=i.__decorate([(0,o.Injectable)(),i.__metadata("design:paramtypes",["function"==typeof(s=void 0!==n.UsersService&&n.UsersService)?s:Object])],a),t.TicketsService=a},"./server/src/users/users.controller.ts":(e,t,r)=>{var s;Object.defineProperty(t,"__esModule",{value:!0}),t.UsersController=void 0;const i=r("tslib"),o=r("@nestjs/common"),n=r("./server/src/utils/random-delay.ts"),a=r("./server/src/users/users.service.ts");let c=class UsersController{constructor(e){this.usersService=e}getUsers(){return i.__awaiter(this,void 0,void 0,(function*(){return this.usersService.users()}))}getUser(e){return i.__awaiter(this,void 0,void 0,(function*(){yield(0,n.randomDelay)();const t=yield this.usersService.user(Number(e));if(t)return t;throw new o.NotFoundException}))}};i.__decorate([(0,o.Get)(),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[]),i.__metadata("design:returntype",Promise)],c.prototype,"getUsers",null),i.__decorate([(0,o.Get)(":id"),i.__param(0,(0,o.Param)("id")),i.__metadata("design:type",Function),i.__metadata("design:paramtypes",[String]),i.__metadata("design:returntype",Promise)],c.prototype,"getUser",null),c=i.__decorate([(0,o.Controller)("users"),i.__metadata("design:paramtypes",["function"==typeof(s=void 0!==a.UsersService&&a.UsersService)?s:Object])],c),t.UsersController=c},"./server/src/users/users.module.ts":(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UsersModule=void 0;const s=r("tslib"),i=r("@nestjs/common"),o=r("./server/src/users/users.service.ts"),n=r("./server/src/users/users.controller.ts");let a=class UsersModule{};a=s.__decorate([(0,i.Module)({controllers:[n.UsersController],providers:[o.UsersService],exports:[o.UsersService]})],a),t.UsersModule=a},"./server/src/users/users.service.ts":(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UsersService=void 0;const s=r("tslib"),i=r("@nestjs/common");let o=class UsersService{constructor(){this.storedUsers=[{id:1,name:"Alice"},{id:2,name:"Bob"},{id:3,name:"Chris"},{id:4,name:"Daisy"},{id:5,name:"Ed"}]}users(){return s.__awaiter(this,void 0,void 0,(function*(){return this.storedUsers}))}user(e){var t;return s.__awaiter(this,void 0,void 0,(function*(){return null!==(t=this.storedUsers.find((t=>t.id===+e)))&&void 0!==t?t:null}))}};o=s.__decorate([(0,i.Injectable)()],o),t.UsersService=o},"./server/src/utils/random-delay.ts":(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.randomDelay=void 0,t.randomDelay=function(e=1e3){return new Promise((t=>{setTimeout((()=>{t()}),Math.random()*e)}))}},"@nestjs/common":e=>{e.exports=require("@nestjs/common")},"@nestjs/core":e=>{e.exports=require("@nestjs/core")},tslib:e=>{e.exports=require("tslib")}},t={};function r(s){var i=t[s];if(void 0!==i)return i.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}var s={};(()=>{var e=s;Object.defineProperty(e,"__esModule",{value:!0});const t=r("tslib"),i=r("@nestjs/common"),o=r("@nestjs/core"),n=r("./server/src/app/app.module.ts");!function(){t.__awaiter(this,void 0,void 0,(function*(){const e=yield o.NestFactory.create(n.AppModule);e.setGlobalPrefix("api");const t=process.env.PORT||3333;yield e.listen(t),i.Logger.log(`\ud83d\ude80 Application is running on: http://localhost:${t}/api`)}))}()})();var i=exports;for(var o in s)i[o]=s[o];s.__esModule&&Object.defineProperty(i,"__esModule",{value:!0})})();
//# sourceMappingURL=main.js.map