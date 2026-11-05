const leads = window.importedLeads || [];
const warmParsitySchoolLeads = [
  { name:"Shravanthi Manohar", company:"—", title:"—", phone:"—", email:"shrivantimanohar@gmail.com", linkedin:"", location:"—", zone:"—", source:"Parsity Slack · #leads", stage:"New", followOffset:null, notes:"Warm Parsity School lead · email only.", campaign:"warm-parsity-school" },
  { name:"Dan Mahler", company:"—", title:"—", phone:"+1 717 870 8797", email:"—", linkedin:"", location:"East Coast", zone:"ET", source:"Parsity Slack · #leads", stage:"New", followOffset:null, notes:"Warm Parsity School lead · East Coast.", campaign:"warm-parsity-school" },
  { name:"Art", company:"—", title:"—", phone:"+1 323 313 2579", email:"—", linkedin:"", location:"West Coast", zone:"PT", source:"Parsity Slack · #leads", stage:"New", followOffset:null, notes:"Warm Parsity School lead · West Coast · last name not confirmed.", campaign:"warm-parsity-school" },
  { name:"Alex Victor Kibet", company:"—", title:"—", phone:"—", email:"alexvictorkibet60@gmail.com", linkedin:"", location:"—", zone:"—", source:"Parsity Slack · #leads", stage:"New", followOffset:null, notes:"Warm Parsity School lead · email only.", campaign:"warm-parsity-school" },
  { name:"Liam Simmons", company:"—", title:"—", phone:"+1 818 458 3662", email:"—", linkedin:"", location:"West Coast", zone:"PT", source:"Parsity Slack · #leads", stage:"New", followOffset:null, notes:"Warm Parsity School lead · West Coast.", campaign:"warm-parsity-school" },
  { name:"Victor", company:"—", title:"—", phone:"+1 510 332 1238", email:"ayeyovic510@gmail.com", linkedin:"", location:"West Coast", zone:"PT", source:"Parsity Slack · #admissions", stage:"New", followOffset:null, notes:"Warm Parsity School lead · West Coast · last name not confirmed.", campaign:"warm-parsity-school" },
  { name:"Wesley", company:"—", title:"—", phone:"+1 509 885 5723", email:"wesmith314@gmail.com", linkedin:"", location:"West Coast", zone:"PT", source:"Parsity Slack · #admissions", stage:"New", followOffset:null, notes:"Warm Parsity School lead · West Coast · last name not confirmed.", campaign:"warm-parsity-school" },
  { name:"Jean Clenor", company:"—", title:"—", phone:"0649506326", email:"jeanclenor2060@gmail.com", linkedin:"", location:"International / unconfirmed", zone:"—", source:"Parsity Slack · #admissions", stage:"New", followOffset:null, notes:"Warm Parsity School lead · phone formatting and region unconfirmed.", campaign:"warm-parsity-school" },
  { name:"Stephen", company:"—", title:"—", phone:"+1 757 218 1299", email:"barberstephen9@gmail.com", linkedin:"", location:"East Coast", zone:"ET", source:"Parsity Slack · #admissions", stage:"New", followOffset:null, notes:"Warm Parsity School lead · East Coast · last name not confirmed.", campaign:"warm-parsity-school" },
  { name:"Franklin", company:"—", title:"—", phone:"+1 431 458 4021", email:"kubafranklin10@gmail.com", linkedin:"", location:"Central Canada", zone:"CT", source:"Parsity Slack · #admissions", stage:"New", followOffset:null, notes:"Warm Parsity School lead · Central Canada · last name not confirmed.", campaign:"warm-parsity-school" }
];
const slackSourcedWarmLeads = [{"name":"William Loo","company":"—","title":"—","phone":"+19143467092","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Brandon Wright","company":"—","title":"—","phone":"+16024992311","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Parker","company":"—","title":"—","phone":"+14044498581","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Christopher Pierre","company":"—","title":"—","phone":"+16314213515","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Kojo Welbeck","company":"—","title":"—","phone":"+16306246360","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jesus Alvarez","company":"—","title":"—","phone":"+18054535516","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"A Blake","company":"—","title":"—","phone":"+19415277837","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Kirk Halgren","company":"—","title":"—","phone":"+13018483028","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Rolando Miguel Soberon","company":"—","title":"—","phone":"+16173885450","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Shantel Minson","company":"—","title":"—","phone":"+17035867222","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ian Chursky","company":"—","title":"—","phone":"+12063044490","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Lowell Vincent","company":"—","title":"—","phone":"+12563786564","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Asher Wu","company":"—","title":"—","phone":"+15092969594","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Hemanth Dachiraju","company":"—","title":"—","phone":"+16592538760","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Liam Simmons","company":"—","title":"—","phone":"+18184583662","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Art","company":"—","title":"—","phone":"+13233132579","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Dan Mahler","company":"—","title":"—","phone":"+17178708797","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jeffrey Rodgers","company":"—","title":"—","phone":"+14702106917","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Russell Howard","company":"—","title":"—","phone":"+16036316884","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Vin Bala","company":"—","title":"—","phone":"+12146322531","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Francisco López, Jr.","company":"—","title":"—","phone":"+19568019541","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jeremiah Romero","company":"—","title":"—","phone":"+15863588325","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Linda mckinley","company":"—","title":"—","phone":"+18642756427","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Shawn Todero","company":"—","title":"—","phone":"+17168740456","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"jacob palacio","company":"—","title":"—","phone":"+19404009992","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Fo Sho","company":"—","title":"—","phone":"+17637620757","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"sua b","company":"—","title":"—","phone":"+17542295920","email":"—","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Benjamin","company":"—","title":"—","phone":"+13367075847","email":"bdworkma@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Evgenii Kozhushko","company":"—","title":"—","phone":"+14034311336","email":"kozhushkoevgenii@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Matthew","company":"—","title":"—","phone":"+17633106959","email":"ben133144@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Tanner","company":"—","title":"—","phone":"+13853067423","email":"tannerolsen7@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Rakesh","company":"—","title":"—","phone":"+16782850233","email":"rakesh.patel@thekadmia.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Leandra","company":"—","title":"—","phone":"+17189138515","email":"Lm272m@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Lloyd","company":"—","title":"—","phone":"+447791693372","email":"stevens.lloyd@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Travis Burns","company":"—","title":"—","phone":"+15412883214","email":"travisjb0@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Peter","company":"—","title":"—","phone":"+48693602573","email":"pwoloszun@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"ONYEIJE","company":"—","title":"—","phone":"+4915224463004","email":"obabmd.mee@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Tim","company":"—","title":"—","phone":"+14072856993","email":"timjohnson0914@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Benjamin Slater","company":"—","title":"—","phone":"+8201028707100","email":"DJTwoTone@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Natarajan","company":"—","title":"—","phone":"+18573130221","email":"natapillai.app@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Nick","company":"—","title":"—","phone":"+14087849933","email":"nickalara@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Sabrina","company":"—","title":"—","phone":"+15872255375","email":"phpsitescripts@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"itamar","company":"—","title":"—","phone":"+31618807878","email":"itamar.turgman@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ejoke","company":"—","title":"—","phone":"+14697568336","email":"easiforpaul@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Abheet Chawla","company":"—","title":"—","phone":"+15713250797","email":"atchawla1@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Mark","company":"—","title":"—","phone":"+16184448144","email":"exerhombre@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Irfan","company":"—","title":"—","phone":"+923202024244","email":"irfansaeedkhan@protonmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"François","company":"—","title":"—","phone":"+19492998437","email":"francoiscabrol+parsity@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jonathan","company":"—","title":"—","phone":"+15013520744","email":"jonathan.waddell10@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Chris","company":"—","title":"—","phone":"+19707775555","email":"Uschrismartinez@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ervin","company":"—","title":"—","phone":"+18184972298","email":"ean1206@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ricardo","company":"—","title":"—","phone":"+5522996030604","email":"ricardopaes550@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Eileen Rose","company":"—","title":"—","phone":"+18182746276","email":"erabuenaflor@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Felipe","company":"—","title":"—","phone":"+19172841453","email":"felipe19@earthlink.net","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Mary","company":"—","title":"—","phone":"+12565419991","email":"lee.marytherese17@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Lemuel","company":"—","title":"—","phone":"+17275583368","email":"lemrod1969@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ronan","company":"—","title":"—","phone":"+14087126302","email":"ronanborja26@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Wade","company":"—","title":"—","phone":"+17204047916","email":"parsity.subtype285@passmail.net","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Taylor","company":"—","title":"—","phone":"+16034403325","email":"taylor@devbytaylor.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Valentino","company":"—","title":"—","phone":"+35699770477","email":"valentino.trencev@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Mohammad Suhail","company":"—","title":"—","phone":"+966552652605","email":"errtotest@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Rick","company":"—","title":"—","phone":"+13862328503","email":"rick.f.cannone@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"LeAnne","company":"—","title":"—","phone":"+18032208768","email":"branchleannelmb@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Sathmi","company":"—","title":"—","phone":"+16303640346","email":"sathmi@stanford.edu","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Brandon","company":"—","title":"—","phone":"+4915225729714","email":"kokweiong@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Thomas","company":"—","title":"—","phone":"+4915157564373","email":"tom.kealy.tk@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Prabhat","company":"—","title":"—","phone":"+918076992364","email":"prabhatchoubey1994@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Nagacharan","company":"—","title":"—","phone":"+19912495981","email":"nagacharan4286@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Eric","company":"—","title":"—","phone":"+16466230617","email":"erictam.dev@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jesse","company":"—","title":"—","phone":"+17177524114","email":"wood2prog@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Shaun","company":"—","title":"—","phone":"+19706829727","email":"strongestarm@yahoo.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jude","company":"—","title":"—","phone":"+16199095230","email":"yjmariadas@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Liz","company":"—","title":"—","phone":"+13197755084","email":"bizzylizzy0815@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Kanwal","company":"—","title":"—","phone":"+17783205551","email":"kanwal.gupta1@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Larissa","company":"—","title":"—","phone":"+16479687445","email":"larissakabeya@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Caitlin","company":"—","title":"—","phone":"+17578793221","email":"csbweather@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jose","company":"—","title":"—","phone":"+17745516238","email":"jose.loarca.hass@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"LAXMAN KISHOR","company":"—","title":"—","phone":"+15066884057","email":"kishor.auce@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Dan","company":"—","title":"—","phone":"+40769388493","email":"danmoldo23@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Bikramaditya","company":"—","title":"—","phone":"+14082078163","email":"bikramaditya.panda@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Vinayak","company":"—","title":"—","phone":"+919545575883","email":"bhoji.vinayak@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Eric","company":"—","title":"—","phone":"+16673839038","email":"usmcbromell@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Sean","company":"—","title":"—","phone":"+19366975652","email":"swhammond2@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Emmanuel","company":"—","title":"—","phone":"+447752575912","email":"whalesservices@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Kevin","company":"—","title":"—","phone":"+18328919300","email":"kevin.peery@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Chaitanya","company":"—","title":"—","phone":"+918500718669","email":"vankar.chaitanya@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ali","company":"—","title":"—","phone":"+447708217368","email":"a.khal786@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"james","company":"—","title":"—","phone":"+07867987854","email":"james@bibble.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Valeriy Lysenko","company":"—","title":"—","phone":"+19165987431","email":"valeriy100c@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Paola S","company":"—","title":"—","phone":"+11111111111","email":"paito.sanchez.ps@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Nnorom","company":"—","title":"—","phone":"+2348132496853","email":"nnoromjames5@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Alexandra","company":"—","title":"—","phone":"+19414477045","email":"alexandra.ladyzhensky@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Carlos","company":"—","title":"—","phone":"+17866231017","email":"carlosmfins@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Josiah","company":"—","title":"—","phone":"+14173109595","email":"dkaramazov56@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Benjamin","company":"—","title":"—","phone":"+16093207586","email":"ben.corbett.44@icloud.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Daniel","company":"—","title":"—","phone":"+01631737743","email":"contag@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Emily","company":"—","title":"—","phone":"+4917643893259","email":"emilyrachelstickler@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Eric","company":"—","title":"—","phone":"+18052848579","email":"eric.beecroft@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Marwan","company":"—","title":"—","phone":"+967770108459","email":"marouane.bazghifan@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Shrin","company":"—","title":"—","phone":"+919902760193","email":"sharmaks.services@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"LEENA","company":"—","title":"—","phone":"+919885067384","email":"leenair@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"venkata","company":"—","title":"—","phone":"+971586935168","email":"yvnagendrababu@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"George","company":"—","title":"—","phone":"+16476871664","email":"gsaweres@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Tatiana","company":"—","title":"—","phone":"+14025958610","email":"tsg1204@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jamal","company":"—","title":"—","phone":"+19488889407","email":"greggjamal@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Salim Ahmad","company":"—","title":"—","phone":"+2347014242594","email":"komputermada@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Sarmad","company":"—","title":"—","phone":"+923049340357","email":"sarmad.razaq4@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Abdelkarim","company":"—","title":"—","phone":"+351923170645","email":"abdelkarim.aridj@proton.me","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Gavin","company":"—","title":"—","phone":"+17507659539","email":"gkimpson@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Nikitas","company":"—","title":"—","phone":"+46739856284","email":"nikitas.dimitriadis@outlook.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"andrei","company":"—","title":"—","phone":"+40753053001","email":"andreilng@yahoo.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Dinu","company":"—","title":"—","phone":"+40799039163","email":"dinu@dinubarbu.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Joshua","company":"—","title":"—","phone":"+18175841395","email":"joshua.norvelle@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Robert","company":"—","title":"—","phone":"+17736687998","email":"bobbygrdn777@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Andrew","company":"—","title":"—","phone":"+12533106051","email":"andrew.wilsonx@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Nick","company":"—","title":"—","phone":"+15087425506","email":"nicholas.guertin@comcast.net","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Alex","company":"—","title":"—","phone":"+19098355204","email":"alex.lizarde@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Adam","company":"—","title":"—","phone":"+17144013119","email":"adamjabundis@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ayman","company":"—","title":"—","phone":"+201126517150","email":"ayman.1551.salah@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Xavier","company":"—","title":"—","phone":"+18017974644","email":"xvrbradley@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Naeimeh","company":"—","title":"—","phone":"+14168311364","email":"naeimeh@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Ezekeil","company":"—","title":"—","phone":"+639162881943","email":"ezekeilvpahila@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Markus","company":"—","title":"—","phone":"+17865719733","email":"tmacjr23@icloud.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Lisa","company":"—","title":"—","phone":"+16312410736","email":"lissastumpf@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Jon","company":"—","title":"—","phone":"+14153099497","email":"jonbalive@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Daniel","company":"—","title":"—","phone":"+19289198937","email":"dstringvc@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Andrey Tuguchev","company":"—","title":"—","phone":"+77775188123","email":"Tuguchev.Andrey@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Kerline","company":"—","title":"—","phone":"+17867157298","email":"kerline.moncy@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Hanna","company":"—","title":"—","phone":"+447851964207","email":"hannawkozak@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Diane","company":"—","title":"—","phone":"+17044924478","email":"dleighj101@gmail.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Tian","company":"—","title":"—","phone":"+84548784848","email":"tian@kairoscales.com","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"},{"name":"Miguel","company":"—","title":"—","phone":"+351925287962","email":"contact@mfpmartins.dev","linkedin":"","location":"—","zone":"—","source":"Parsity Slack · #leads","stage":"New","followOffset":null,"notes":"Imported from #leads phone audit.","campaign":"warm-parsity-school"}];
const warmLeadKeys = new Set(leads.filter((lead) => lead.campaign === "warm-parsity-school").flatMap(savedLeadIdentitySafe));
function savedLeadIdentitySafe(lead) {
  const email = String(lead.email || "").trim().toLowerCase();
  const phone = String(lead.phone || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return [email && email !== "—" ? "email:" + email : "", phone ? "phone:" + phone : ""].filter(Boolean);
}
for (const lead of [...warmParsitySchoolLeads, ...slackSourcedWarmLeads]) {
  const keys = savedLeadIdentitySafe(lead);
  if (keys.some((key) => warmLeadKeys.has(key))) continue;
  keys.forEach((key) => warmLeadKeys.add(key));
  leads.push(lead);
}
const campaigns = [
  { id: "school", name: "Parsity School", status: "Active", leads: leads.filter((lead) => lead.campaign === "school").length, calls: 0, talk: "0m", appointments: 0, deals: 0, connect: "0%", followups: 0 },
  { id: "warm-parsity-school", name: "Warm Parsity School Leads", status: "Active", leads: leads.filter((lead) => lead.campaign === "warm-parsity-school").length, calls: 0, talk: "0m", appointments: 0, deals: 0, connect: "0%", followups: 0 },
  { id: "business", name: "Parsity Business", status: "Active", leads: leads.filter((lead) => lead.campaign === "business").length, calls: 0, talk: "0m", appointments: 0, deals: 0, connect: "0%", followups: 0 },
  { id: "reviews", name: "Onyx Reviews", status: "Active", leads: 0, calls: 0, talk: "0m", appointments: 0, deals: 0, connect: "0%", followups: 0 },
  { id: "quantum-bom", name: "Quantum Bom", status: "Active", leads: 0, calls: 0, talk: "0m", appointments: 0, deals: 0, connect: "0%", followups: 0 },
];
const activityStorageKey = "calldesk-ui-test-activity-v1";
let activityState = {};
try { activityState = JSON.parse(localStorage.getItem(activityStorageKey) || "{}"); } catch { activityState = {}; }
// Contractor access is now stored securely on the server. Remove the old
// browser-only contractor list once, while leaving all other dialer activity.
if (Array.isArray(activityState.contractors)) {
  delete activityState.contractors;
  try { localStorage.setItem(activityStorageKey, JSON.stringify(activityState)); } catch {}
}
const savedLeadIdentity = (lead) => {
  const email = String(lead.email || "").trim().toLowerCase();
  const phone = String(lead.phone || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return [email && email !== "—" ? "email:" + email : "", phone ? "phone:" + phone : ""].filter(Boolean);
};
if (Array.isArray(activityState.importedLeads)) {
  const savedLeadKeys = new Set(leads.flatMap((lead) => savedLeadIdentity(lead).map((key) => lead.campaign + ":" + key)));
  activityState.importedLeads.forEach((lead) => {
    const keys = savedLeadIdentity(lead).map((key) => lead.campaign + ":" + key);
    if (keys.some((key) => savedLeadKeys.has(key))) return;
    keys.forEach((key) => savedLeadKeys.add(key));
    leads.push(lead);
  });
}

// Keep the Parsity School queue clean across all static and saved imports.
// The newest occurrence wins so richer, later CSV rows are retained.
const schoolLeadKeys = new Set();
for (let index = leads.length - 1; index >= 0; index -= 1) {
  const lead = leads[index];
  if (lead.campaign !== "school") continue;
  const keys = savedLeadIdentity(lead);
  if (keys.length && keys.some((key) => schoolLeadKeys.has(key))) leads.splice(index, 1);
  else keys.forEach((key) => schoolLeadKeys.add(key));
}

// Append after saved imports so existing index-based activity IDs stay intact.
const companyKey = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const phoneKey = (value) => String(value || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
for (const candidate of window.nonTechnicalResearchLeads || []) {
  const existing = leads.find((lead) => lead.campaign === "business" &&
    (companyKey(lead.company) === companyKey(candidate.company) || phoneKey(lead.phone) === phoneKey(candidate.phone)));
  if (existing) existing.subTag = "Non-technical";
  else leads.push({ ...candidate });
}

function isDialableNorthAmericanPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  const tenDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(tenDigits) && tenDigits.slice(3, 6) !== "555";
}

function formatPhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw || raw === "—") return "—";
  const digits = raw.replace(/\D/g, "");
  const tenDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(tenDigits)
    ? `${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`
    : raw;
}

// The dialer uses the four primary North American calling windows.  Area-code
// assignments are more reliable than a lead's free-form location field, and
// are applied only when a record did not come with an explicit time zone.
const areaCodesByTimeZone = {
  PT: "206 209 213 253 279 310 323 341 360 369 408 415 424 442 458 503 509 510 530 541 559 562 619 626 628 650 657 661 669 702 707 714 725 747 760 775 805 818 831 858 909 916 925 949 951 971 236 250 604 672 778 825".split(" "),
  MT: "208 303 307 385 406 435 480 505 520 575 602 623 720 801 928 970 403 587 780".split(" "),
  CT: "210 214 217 218 224 225 251 262 269 281 308 309 312 316 319 320 325 331 334 337 346 361 402 405 409 417 430 432 469 479 501 504 507 515 531 539 563 573 601 605 608 612 615 618 620 630 636 641 651 660 682 701 712 713 715 726 731 737 763 769 773 779 806 815 816 817 830 832 847 870 872 901 903 913 918 920 936 940 952 956 972 979 985 204 431 807".split(" ")
};
const areaCodeToTimeZone = Object.fromEntries(Object.entries(areaCodesByTimeZone).flatMap(([zone, codes]) => codes.map((code) => [code, zone])));

function timeZoneFromAreaCode(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  const tenDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (!/^[2-9]\d{9}$/.test(tenDigits)) return "";
  // Remaining NANP area codes are predominantly Eastern.  This covers valid
  // East Coast numbers without labeling international numbers as callable.
  return areaCodeToTimeZone[tenDigits.slice(0, 3)] || "ET";
}

function normalizedTimeZone(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (["ET", "EST", "EDT", "EASTERN"].includes(raw)) return "ET";
  if (["CT", "CST", "CDT", "CENTRAL"].includes(raw)) return "CT";
  if (["MT", "MST", "MDT", "MOUNTAIN"].includes(raw)) return "MT";
  if (["PT", "PST", "PDT", "PACIFIC"].includes(raw)) return "PT";
  return "";
}

function normalizeLinkedInUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "—") return "";
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/\//, "")}`;
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return "";
    url.protocol = "https:";
    return url.href;
  } catch { return ""; }
}

const savedCampaigns = activityState.campaigns || {};
campaigns.forEach((campaign) => Object.assign(campaign, savedCampaigns[campaign.id] || {}));
campaigns.forEach((campaign) => {
  campaign.leads = leads.filter((lead) => lead.campaign === campaign.id).length;
});
const statsResetVersion = "calls-talk-reset-v1";
let statsResetAt = Number(activityState.statsResetAt || 0);
const statsWereReset = activityState.statsResetVersion !== statsResetVersion;
if (statsWereReset) {
  campaigns.forEach((campaign) => { campaign.calls = 0; campaign.talkSeconds = 0; campaign.talk = "0m"; });
  statsResetAt = Date.now();
  activityState.statsResetVersion = statsResetVersion;
}
let callLog = Array.isArray(activityState.callLog) ? activityState.callLog : [];
let appointments = Array.isArray(activityState.appointments) ? activityState.appointments : [];
let sharedAppointments = [];
const appointmentResetVersion = "onyx-reviews-appointment-reset-v1";
const appointmentWasCleared = activityState.appointmentResetVersion !== appointmentResetVersion;
const clearedAppointmentLeadIds = new Set();
if (appointmentWasCleared) {
  appointments.filter((appointment) => appointment.campaign === "Onyx Reviews").forEach((appointment) => clearedAppointmentLeadIds.add(appointment.leadId));
  appointments = appointments.filter((appointment) => appointment.campaign !== "Onyx Reviews");
  const reviewsCampaign = campaigns.find((campaign) => campaign.id === "reviews");
  if (reviewsCampaign) reviewsCampaign.appointments = 0;
  activityState.appointmentResetVersion = appointmentResetVersion;
}
const followupResetVersion = "quantum-bom-followup-reset-v1";
const quantumBomFollowupWasCleared = activityState.followupResetVersion !== followupResetVersion;
if (quantumBomFollowupWasCleared) activityState.followupResetVersion = followupResetVersion;
let voipProvider = activityState.voipProvider || "";
let goals = { callGoals: { school: 120, business: 120, "quantum-bom": 120, reviews: 120 }, appointmentGoals: { school: 3, business: 3, "quantum-bom": 3, reviews: 0 }, closeRatios: {}, ...(activityState.goals || {}) };
let contractors = [];
let editingContractorEmail = "";
const legacyBoardRemoved = Array.isArray(activityState.salesBoardCards);
if (legacyBoardRemoved) delete activityState.salesBoardCards;
let celebrationClipUrl = "";
const callScripts = {
  school: { opener: "Hi, this is [Rep] with Parsity. I’m calling to learn how your school currently supports career-ready technology training.", questions: "What programs are you offering today? Who owns curriculum decisions? What outcomes matter most this term?", objections: "If timing is the concern, offer a short follow-up. If budget is the concern, ask about the next planning cycle." },
  business: { opener: "Hi, this is [Rep] with Parsity. We help engineering teams already using Claude, Codex, or Copilot turn those subscriptions into faster, safer production delivery. I wanted to see how your team is measuring the return on AI-assisted engineering.", questions: "Which AI coding tools are engineers using today? Has delivery velocity moved since rollout? How do you review AI-generated code for security, reliability, and edge cases? Would a free training session or a 30-minute sit-down with a few engineers be useful?", objections: "This is not a fixed-price pitch. Offer the free training session or 30-minute team conversation first. Focus on improving delivery against the roadmap, reducing contractor or hiring dependency, and helping engineers use AI with confidence. The full engagement is scoped after learning what the team needs." },
  reviews: { opener: "Hi, this is [Rep] with Onyx. I’m following up on your recent experience and would value a quick review.", questions: "How was your overall experience? What stood out? Is there anything we should improve?", objections: "Acknowledge concerns, avoid pressure, and offer a manager follow-up when needed." },
};
const leadMiningProfiles = {
  "quantum-bom": {
    verticals: ["Gulf Coast refinery and petrochemical EPCs", "Industrial piping and turnaround contractors", "Process-piping fabrication shops", "Refinery, chemical, and LNG owner-operators", "Data-center mechanical contractors", "Data-center developers and EPC partners", "Mining EPCs and process-plant contractors", "Water and wastewater contractors", "Food, beverage, pharmaceutical, and biotech process contractors", "Power-generation and carbon-capture contractors"],
    titles: ["VP of Estimating", "Chief Estimator", "Preconstruction Director", "Procurement Director", "Project Controls Manager", "Operations Manager", "Turnaround Manager"],
    qualification: "Prioritize organizations with IFC isometrics, P&IDs, GA drawings, line lists, piping specs, or active capital and turnaround projects."
  }
};

const queueStartedAt = Date.now();
leads.forEach((lead, index) => {
  lead.id = index;
  const savedLead = (activityState.leads || {})[index] || {};
  lead.followAt = savedLead.followAt ?? (lead.followOffset === null ? null : queueStartedAt + lead.followOffset * 60000);
  lead.notes = savedLead.notes ?? lead.notes;
  lead.industry = savedLead.industry ?? lead.industry ?? "";
  lead.disposition = savedLead.disposition || "";
  lead.called = Boolean(savedLead.called);
  lead.attempts = Number(savedLead.attempts || 0);
  lead.stage = savedLead.stage || lead.stage;
  lead.stageBeforeDnc = savedLead.stageBeforeDnc || "";
  lead.wonAt = savedLead.wonAt || null;
  lead.dnc = Boolean(savedLead.dnc ?? lead.dnc);
  lead.lastContact = savedLead.lastContact || "";
  const inferredZone = timeZoneFromAreaCode(lead.phone);
  const suppliedZone = normalizedTimeZone(lead.zone);
  // Older CSV imports were all stamped ET. Recalculate those records from
  // their phone area codes; hand-entered/source-provided zones remain intact.
  if (lead.source === "CSV import" && inferredZone) {
    lead.zone = inferredZone;
    lead.zoneSource = "area-code";
  } else if (suppliedZone) {
    lead.zone = suppliedZone;
  } else if (inferredZone) {
    lead.zone = inferredZone;
    lead.zoneSource = "area-code";
  } else {
    lead.zone = "—";
  }
  if (appointmentWasCleared && clearedAppointmentLeadIds.has(lead.id) && lead.stage === "Appointment Set") lead.stage = "Contacted";
  if (quantumBomFollowupWasCleared && lead.campaign === "quantum-bom" && lead.followAt !== null) lead.followAt = null;
});
const removedNonDialableLeadCount = leads.filter((lead) => !isDialableNorthAmericanPhone(lead.phone)).length;
for (let index = leads.length - 1; index >= 0; index -= 1) {
  if (!isDialableNorthAmericanPhone(leads[index].phone) && leads[index].campaign !== "warm-parsity-school") leads.splice(index, 1);
}
campaigns.forEach((campaign) => { campaign.leads = leads.filter((lead) => lead.campaign === campaign.id).length; });

const toast = document.getElementById("toast");
let toastTimer;
let selectedIndex = -1;
let callSeconds = 0;
let callInterval;
let currentPage = 0;
let activeCampaign = "school";
let activeCallLeadId = null;
let statsMode = "overall";
const pageSize = 20;
const getLead = (id) => leads.find((lead) => lead.id === id);
const todayForStats = new Date();
document.getElementById("statsDate").value = new Date(todayForStats.getTime() - todayForStats.getTimezoneOffset() * 60000).toISOString().slice(0,10);

function persistActivity() {
  const campaignData = Object.fromEntries(campaigns.map((campaign) => [campaign.id, {
    calls: campaign.calls, talk: campaign.talk, talkSeconds: campaign.talkSeconds || 0,
    appointments: campaign.appointments, deals: campaign.deals, connect: campaign.connect,
  }]));
  const leadData = Object.fromEntries(leads.filter((lead) => lead.industry || lead.notes || lead.disposition || lead.followAt !== null || lead.called || lead.wonAt || lead.dnc).map((lead) => [lead.id, {
    industry: lead.industry || "",
    notes: lead.notes, disposition: lead.disposition || "", followAt: lead.followAt, called: lead.called,
    attempts: lead.attempts || 0, stage: lead.stage, stageBeforeDnc: lead.stageBeforeDnc || "", wonAt: lead.wonAt || null, dnc: Boolean(lead.dnc), lastContact: lead.lastContact || "",
  }]));
  const importedLeads = leads.filter((lead) => lead.source === "CSV import").map(({id,followAt,attempts,called,dnc,lastContact,disposition,...lead}) => lead);
    localStorage.setItem(activityStorageKey, JSON.stringify({ campaigns: campaignData, leads: leadData, callLog, appointments, voipProvider, goals, statsResetAt, statsResetVersion, appointmentResetVersion, followupResetVersion, importedLeads }));
}

function refreshActivityViews() {
  renderCampaigns();
  updateMetrics(activeCampaign);
  renderRows();
  renderCallHistory();
  renderCalendar();
  renderComparison();
  renderGoals();
  renderContractors();
  const selectedLead = getLead(selectedIndex);
  if (selectedLead) {
    document.getElementById("detailAttempts").textContent = `${selectedLead.attempts || 0}`;
    document.getElementById("detailStage").value = selectedLead.stage || "New";
    renderLeadHistory(selectedLead);
    renderCompanyOverview(selectedLead);
    renderCompanyIntelligence(selectedLead);
  }
}

function renderContractors() {
  const access = document.getElementById("contractorCampaignAccess");
  const rows = document.getElementById("contractorRows");
  if (!access || !rows) return;
  access.innerHTML = campaigns.map((campaign) => `<label><input type="checkbox" name="contractorCampaign" value="${escapeHtml(campaign.id)}" /> ${escapeHtml(campaign.name)}</label>`).join("");
  document.getElementById("contractorCount").textContent = `${contractors.length} contractor${contractors.length === 1 ? "" : "s"}`;
  if (!contractors.length) {
    rows.innerHTML = '<div class="contractor-empty">No contractors added yet. Add Sierra to prepare her Onyx Reviews access.</div>';
    return;
  }
  rows.innerHTML = contractors.map((contractor) => {
    const campaignNames = contractor.campaigns.map((id) => campaigns.find((campaign) => campaign.id === id)?.name).filter(Boolean);
    const status = contractor.status === "invite_failed" ? "Invite failed" : "Invite sent";
    return `<div class="contractor-row"><span><strong>${escapeHtml(contractor.name)}</strong><small>${escapeHtml(contractor.email)}</small></span><span><strong>${escapeHtml(contractor.phone || "No phone on file")}</strong><small>Caller contact</small></span><span><strong>${escapeHtml(`${contractor.dailyCallGoal ?? 120} calls · ${contractor.dailyAppointmentGoal ?? 3} appts`)}</strong><small>Daily goals</small></span><span><strong>${escapeHtml(campaignNames.join(", ") || "No campaigns assigned")}</strong><small>Campaign access</small></span><span><i class="contractor-status">${status}</i><button type="button" class="secondary contractor-edit" data-contractor-email="${escapeHtml(contractor.email)}">Edit</button></span></div>`;
  }).join("");
  rows.querySelectorAll(".contractor-edit").forEach((button) => {
    button.onclick = () => openContractorForm(contractors.find((contractor) => contractor.email === button.dataset.contractorEmail));
  });
}

function openContractorForm(contractor = null) {
  const form = document.getElementById("contractorForm");
  editingContractorEmail = contractor?.email || "";
  form.hidden = false;
  document.getElementById("contractorName").value = contractor?.name || "";
  const email = document.getElementById("contractorEmail");
  email.value = contractor?.email || "";
  email.disabled = Boolean(contractor);
  document.getElementById("contractorPhone").value = contractor?.phone || "";
  document.getElementById("contractorCallGoal").value = contractor?.dailyCallGoal ?? 120;
  document.getElementById("contractorAppointmentGoal").value = contractor?.dailyAppointmentGoal ?? 3;
  document.getElementById("contractorNotes").value = contractor?.notes || "";
  document.querySelectorAll('input[name="contractorCampaign"]').forEach((input) => {
    input.checked = Boolean(contractor?.campaigns.includes(input.value));
  });
  document.getElementById("sendContractorInvite").textContent = contractor ? "Save changes" : "Send invite";
  document.getElementById("contractorFormHelp").textContent = contractor
    ? "Adding a new campaign sends a campaign-access email. Other updates do not resend the invitation."
    : "An invitation email with a secure sign-in link will be sent immediately.";
  document.getElementById("contractorName").focus();
}

async function loadContractors() {
  try {
    const response = await fetch("/api/admin/contractors", { cache: "no-store" });
    if (!response.ok) throw new Error("Contractor access is unavailable");
    const payload = await response.json();
    contractors = Array.isArray(payload.contractors) ? payload.contractors : [];
    renderContractors();
  } catch {
    notify("Unable to load contractor access");
  }
}

function renderCallHistory() {
  const rows = document.getElementById("callHistoryRows");
  document.getElementById("callHistoryCount").textContent = `${callLog.length} call${callLog.length === 1 ? "" : "s"}`;
  rows.innerHTML = callLog.length ? callLog.map((entry, index) => ({ entry, index })).reverse().map(({ entry, index }) => `<div class="history-row call-history-item" data-call-index="${index}" role="button" tabindex="0" aria-label="View call details for ${escapeHtml(entry.name)}"><span>${escapeHtml(entry.name)}</span><span>${escapeHtml(entry.campaign)}</span><span>${escapeHtml(formatPhone(entry.phone))}</span><span>${new Date(entry.at).toLocaleString([], {month:"short", day:"numeric", hour:"numeric", minute:"2-digit"})}</span></div>`).join("") : '<div class="history-empty">No calls recorded yet.</div>';
  rows.querySelectorAll(".call-history-item").forEach((row) => {
    const open = () => showCallDetails(Number(row.dataset.callIndex));
    row.onclick = open;
    row.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } };
  });
}

function formatCallDuration(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "Not recorded";
  return value >= 60 ? `${Math.floor(value / 60)}m ${value % 60}s` : `${value}s`;
}

function showCallDetails(callIndex) {
  const entry = typeof callIndex === "object" ? callIndex : callLog[callIndex];
  if (!entry) return;
  const lead = leads.find((item) => item.id === entry.leadId);
  const followUp = lead?.followAt ? new Date(lead.followAt).toLocaleString([], { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" }) : "None scheduled";
  document.getElementById("callDetailsTitle").textContent = entry.name || "Call details";
  document.getElementById("callDetailsSubtitle").textContent = `${entry.campaign || "—"} · ${formatPhone(entry.phone)}`;
  const fields = [
    ["Called by", entry.actorEmail || "Admin"],
    ["Called at", new Date(entry.at).toLocaleString([], { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit" })],
    ["Call length", formatCallDuration(entry.duration)],
    ["Disposition", entry.disposition || "Not recorded"],
    ["Lead stage", lead?.stage || "Not recorded"],
    ["Attempts", String(lead?.attempts || 0)],
    ["Follow-up", followUp],
    ["Appointment", entry.appointment || "None booked"],
    ["Time zone", lead?.zone || "Not recorded"]
  ];
  document.getElementById("callDetailsGrid").innerHTML = fields.map(([label, value]) => `<div class="call-detail-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  document.getElementById("callDetailsNote").textContent = entry.note || (entry.actorEmail ? "" : lead?.notes) || "No call notes recorded.";
  document.getElementById("callDetailsModal").classList.add("open");
  document.getElementById("callDetailsModal").setAttribute("aria-hidden", "false");
}

function closeCallDetails() {
  document.getElementById("callDetailsModal").classList.remove("open");
  document.getElementById("callDetailsModal").setAttribute("aria-hidden", "true");
}

function renderCalendar() {
  const range = document.getElementById("calendarRange").value;
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(start); end.setDate(end.getDate() + (range === "day" ? 1 : 7));
  const selectedCampaign = campaigns.find((campaign) => campaign.id === document.getElementById("campaignSelect").value);
  const visible = [...appointments, ...sharedAppointments].filter((appointment) => {
    const matchesScope = statsMode === "overall" || appointment.campaign === selectedCampaign?.name;
    const matchesRange = range === "all" || (appointment.startsAt && new Date(appointment.startsAt) >= start && new Date(appointment.startsAt) < end);
    return matchesScope && matchesRange;
  });
  document.getElementById("appointmentCount").textContent = `${visible.length} appointment${visible.length === 1 ? "" : "s"}`;
  document.getElementById("calendarRows").innerHTML = visible.length ? [...visible].sort((a,b) => String(a.startsAt || "9999").localeCompare(String(b.startsAt || "9999"))).map((entry) => `<div class="history-row"><span>${escapeHtml(entry.name)}</span><span>${escapeHtml(entry.campaign)}</span><span>${escapeHtml(entry.type)}</span><span>${entry.startsAt ? new Date(entry.startsAt).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : "Confirmed in Calendly"}</span></div>`).join("") : '<div class="history-empty">No appointments in this range.</div>';
}

function openAppointments() {
  const panel = document.getElementById("calendarPanel");
  document.getElementById("calendarRange").value = "all";
  panel.hidden = false;
  document.getElementById("toggleCalendar").textContent = "Hide calendar";
  renderCalendar();
  panel.scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderComparison() {
  document.getElementById("comparisonRows").innerHTML = campaigns.map((campaign) => `<div class="history-row"><span>${escapeHtml(campaign.name)}</span><span>${campaign.connect}</span><span>${campaign.calls ? Math.round((campaign.appointments / campaign.calls) * 100) : 0}%</span><span>${campaign.deals}</span></div>`).join("");
}

function renderLeadHistory(lead) {
  const history = callLog.filter((entry) => entry.leadId === lead.id);
  document.getElementById("leadHistoryCount").textContent = `${history.length} attempt${history.length === 1 ? "" : "s"}`;
  document.getElementById("leadCallHistory").innerHTML = history.length ? [...history].reverse().map((entry) => `<div class="lead-history-row"><strong>${new Date(entry.at).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</strong> · ${entry.duration || 0}s · ${escapeHtml(entry.disposition || "No disposition")}<br>${escapeHtml(entry.note || "No note")}${entry.appointment ? `<br>Appointment: ${escapeHtml(entry.appointment)}` : ""}</div>`).join("") : '<div class="history-empty">No calls for this lead yet.</div>';
  if (lead.sharedLeadId) loadLeadCallHistory(lead, history);
}

async function loadLeadCallHistory(lead, localHistory) {
  try {
    const response = await fetch(`/api/operations/leads/${encodeURIComponent(lead.sharedLeadId)}`, { cache:"no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load shared calls");
    if (selectedIndex !== lead.id) return;
    const calls = (payload.activities || []).filter((activity) => activity.activity_type === "call");
    // Admin calls are already in its local log; the shared contractor records
    // are read directly and never copied into that browser-owned log.
    const history = [...localHistory.map((entry) => ({ ...entry, actorEmail:"Admin" })), ...calls.filter((call) => call.actor_role === "contractor").map((call) => ({ at:call.created_at, actorEmail:call.actor_email, disposition:call.disposition, note:call.note, duration:call.duration_seconds }))].sort((a,b) => new Date(b.at) - new Date(a.at));
    document.getElementById("leadHistoryCount").textContent = `${history.length} calls`;
    document.getElementById("leadCallHistory").innerHTML = history.length ? history.map((entry) => `<div class="lead-history-row"><strong>${escapeHtml(activityDate(entry.at))}</strong> · Called by ${escapeHtml(entry.actorEmail)}<br>${escapeHtml(entry.disposition || "Call logged")}${entry.duration ? ` · ${formatCallDuration(entry.duration)}` : ""}<br>${escapeHtml(entry.note || "No call note")}</div>`).join("") : '<div class="history-empty">No calls for this lead yet.</div>';
  } catch {
    if (selectedIndex === lead.id) document.getElementById("leadCallHistory").insertAdjacentHTML("beforeend", '<div class="history-empty">Shared call history could not be loaded. Reopen this lead to retry.</div>');
  }
}

function renderCompanyOverview(lead) {
  const present = (value) => String(value || "").trim() && String(value).trim() !== "—";
  const campaign = campaigns.find((item) => item.id === lead.campaign)?.name || "—";
  const ownerLike = /owner|founder|president|chief executive|ceo/i.test(String(lead.title || ""));
  const contactLabel = ownerLike ? "Owner / primary contact" : "Primary contact";
  const items = [];
  if (present(lead.company)) items.push(["Company", lead.company]);
  if (present(lead.location)) items.push(["Location", lead.location]);
  if (present(lead.industry)) items.push(["Industry", lead.industry]);
  if (present(lead.subTag)) items.push(["Sub-tag", lead.subTag]);
  if (present(lead.name)) items.push([contactLabel, `${lead.name}${present(lead.title) ? ` · ${lead.title}` : ""}`]);
  if (present(lead.phone)) items.push(["Phone", formatPhone(lead.phone)]);
  if (present(lead.email)) items.push(["Email", lead.email]);
  if (present(campaign)) items.push(["Campaign", campaign]);
  document.getElementById("companyOverview").innerHTML = items.length ? items.map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong>${escapeHtml(value)}</li>`).join("") : "<li>No company or owner information is available.</li>";
}

function renderCompanyIntelligence(lead) {
  const note = String(lead.notes || "");
  const employeeMatch = note.match(/\b([\d,]+)\s+employees\b/i);
  const employeeCount = lead.employees || lead.employeeCount || (employeeMatch ? employeeMatch[1] : "");
  const revenue = lead.revenue || lead.annualRevenue || lead.estimatedRevenue || "";
  const campaignInsights = {
    school: "Explore current technology-training outcomes, program ownership, and planning timing.",
    business: "Explore AI engineering-tool adoption, delivery velocity, code quality, and measurable ROI.",
    reviews: "Explore the customer experience, recent feedback, and opportunities to strengthen review volume.",
    "quantum-bom": "Explore estimating, operations, project-delivery, or procurement priorities tied to the company’s work."
  };
  const items = [
    ["Employee count", employeeCount ? `${employeeCount} employees` : "Not available in lead data"],
    ["Revenue", revenue || "Research needed — no revenue data loaded"],
    ["Sales cue", campaignInsights[lead.campaign] || "Research needed"],
    ["Data source", lead.source || "Not recorded"]
  ];
  document.getElementById("companyIntelligence").innerHTML = items.map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong>${escapeHtml(value)}</li>`).join("");
}

function formatTalkTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}

function updateConnectRate(campaign) {
  const connected = leads.filter((lead) => lead.campaign === campaign.id && ["Connected — qualified", "Connected — follow up"].includes(lead.disposition)).length;
  campaign.connect = campaign.calls ? `${Math.round((connected / campaign.calls) * 100)}%` : "0%";
}

function updateFollowups(campaign) {
  const savedFollowups = leads.filter((lead) => lead.campaign === campaign.id && lead.followAt !== null).length;
  if (savedFollowups || !campaign.followups) campaign.followups = savedFollowups;
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function celebrationClipStore(mode, value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("onyx-dialer-settings", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("audio");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction("audio", mode === "get" ? "readonly" : "readwrite");
      const store = transaction.objectStore("audio");
      const operation = mode === "get" ? store.get("celebration") : mode === "set" ? store.put(value, "celebration") : store.delete("celebration");
      operation.onsuccess = () => resolve(operation.result);
      operation.onerror = () => reject(operation.error);
    };
  });
}

function updateCelebrationControls(record) {
  const hasClip = Boolean(record);
  document.getElementById("previewCelebration").disabled = !hasClip;
  document.getElementById("removeCelebration").disabled = !hasClip;
  const status = document.getElementById("celebrationStatus");
  status.textContent = hasClip ? `${record.name} · ${Math.ceil(record.duration)} second clip ready` : "No celebration clip added";
  status.classList.toggle("ready", hasClip);
}

async function loadCelebrationClip() {
  try {
    const record = await celebrationClipStore("get");
    if (celebrationClipUrl) URL.revokeObjectURL(celebrationClipUrl);
    celebrationClipUrl = record ? URL.createObjectURL(record.blob) : "";
    updateCelebrationControls(record);
  } catch {
    document.getElementById("celebrationStatus").textContent = "Clip storage is unavailable in this browser";
  }
}

function readClipDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(audio.duration); };
    audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Unable to read this audio file")); };
    audio.src = url;
  });
}

function playCelebration() {
  if (!celebrationClipUrl) return;
  const audio = new Audio(celebrationClipUrl);
  audio.volume = 0.8;
  audio.play().catch(() => notify("Celebration clip is ready — click Preview to test audio"));
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

let sharedWorkspace = { campaigns: [], leads: [] };
let adminSyncSnapshot = null;
let adminSyncPreview = null;
let contractorReport = null;
let sharedCallHistory = { calls:[], total:0 };
let sharedCallPage = 0;
let contractorActivityRequest = 0;
const sharedCallPageSize = 20;

function reportDateRange(date, period = "day") {
  const anchor = new Date(`${date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(anchor.valueOf()) || anchor.toISOString().slice(0,10) !== date) throw new Error("Choose a valid stats date.");
  const start = new Date(anchor);
  const end = new Date(anchor);
  if (period === "week") {
    start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7);
    end.setTime(start.valueOf()); end.setUTCDate(end.getUTCDate() + 6);
  } else if (period === "month") {
    start.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + 1, 0);
  }
  return { from:start.toISOString().slice(0,10), to:end.toISOString().slice(0,10) };
}

function currentReportRange() {
  return reportDateRange(document.getElementById("statsDate").value, document.getElementById("statsPeriod").value);
}

function reportRangeLabel({ from, to }) {
  const format = (day) => new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { timeZone:"UTC", month:"short", day:"numeric", year:"numeric" });
  return from === to ? format(from) : `${format(from)} – ${format(to)}`;
}

function contractorReportKey() {
  const { from, to } = currentReportRange();
  return `${from}|${to}|${statsMode === "overall" ? "" : document.getElementById("campaignSelect").value}`;
}

function renderSharedCallHistory() {
  const { calls, total } = sharedCallHistory;
  document.getElementById("sharedCallHistoryCount").textContent = `${total} calls logged`;
  document.getElementById("sharedCallHistoryRows").innerHTML = calls.length ? calls.map((call, index) => `<div class="history-row shared-call-row" data-shared-call="${index}" role="button" tabindex="0"><span><strong>${escapeHtml(call.lead_name)}</strong><br>${escapeHtml(call.campaign_name)}</span><span>${escapeHtml(call.actor_email)}</span><span>${escapeHtml(call.disposition || "Call logged")}</span><span>${escapeHtml(activityDate(call.created_at))}</span></div>`).join("") : '<div class="history-empty">No BDR calls logged for this campaign yet.</div>';
  document.querySelectorAll(".shared-call-row").forEach((row) => {
    const open = () => {
      const call = calls[Number(row.dataset.sharedCall)];
      showCallDetails({ leadId:leads.find((lead) => lead.sharedLeadId === call.lead_id)?.id, name:call.lead_name, campaign:call.campaign_name, phone:call.phone, at:call.created_at, actorEmail:call.actor_email, disposition:call.disposition, duration:call.duration_seconds, note:call.note });
    };
    row.onclick = open;
    row.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } };
  });
  document.getElementById("sharedCallHistoryPage").textContent = total ? `${sharedCallPage * sharedCallPageSize + 1}–${Math.min((sharedCallPage + 1) * sharedCallPageSize, total)} of ${total}` : "0 calls";
  document.getElementById("sharedCallsPrevious").disabled = sharedCallPage === 0;
  document.getElementById("sharedCallsNext").disabled = (sharedCallPage + 1) * sharedCallPageSize >= total;
}

async function refreshContractorActivity() {
  const request = ++contractorActivityRequest;
  let key;
  try { key = contractorReportKey(); } catch (error) {
    document.getElementById("contractorReportScope").textContent = error.message;
    return;
  }
  const [from, to, campaign] = key.split("|");
  const scope = campaign ? campaigns.find((item) => item.id === campaign)?.name || campaign : "All campaigns";
  const params = new URLSearchParams({ from, to });
  if (campaign) params.set("campaign", campaign);
  const historyParams = new URLSearchParams({ contractorsOnly:"true", offset:String(sharedCallPage * sharedCallPageSize), limit:String(sharedCallPageSize) });
  const historyCampaign = document.getElementById("sharedCallsCampaign").value;
  if (historyCampaign) historyParams.set("campaign", historyCampaign);
  const historyScope = campaigns.find((item) => item.id === historyCampaign)?.name || "All campaigns";
  document.getElementById("sharedCallHistoryScope").textContent = `All dates · ${historyScope}`;
  if (contractorReport?.key !== key) {
    document.getElementById("contractorReportScope").textContent = `${scope} · ${reportRangeLabel({ from, to })} · Loading…`;
    document.getElementById("contractorReportRows").innerHTML = '<div class="history-empty">Loading contractor activity…</div>';
  }
  const results = await Promise.allSettled([
    fetch(`/api/admin/call-report?${params}`, { cache:"no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; }),
    fetch(`/api/operations/calls?${historyParams}`, { cache:"no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; }),
  ]);
  if (request !== contractorActivityRequest) return;
  try { if (key !== contractorReportKey()) return; } catch { return; }
  if (results[0].status === "fulfilled") {
    contractorReport = { ...results[0].value, key };
    document.getElementById("contractorReportScope").textContent = `${scope} · ${reportRangeLabel({ from, to })} · Pacific time${document.getElementById("statsPeriod").value === "week" ? " · Monday–Sunday" : ""}`;
    document.getElementById("contractorReportRows").innerHTML = '<div class="contractor-report-row report-head"><span>Contractor</span><span>Calls logged</span><span>Outcomes recorded</span><span>Appointments booked</span><span>Last call</span></div>' + contractorReport.contractors.map((row) => `<div class="contractor-report-row"><span><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.email)}</small></span><span>${row.calls}</span><span>${row.outcomes}</span><span>${row.appointments}</span><span>${row.last_call_at ? escapeHtml(activityDate(row.last_call_at)) : "—"}</span></div>`).join("");
  } else {
    contractorReport = null;
    document.getElementById("contractorReportScope").textContent = "Report unavailable. Select Refresh to retry.";
    document.getElementById("contractorReportRows").innerHTML = "";
  }
  if (results[1].status === "fulfilled") {
    sharedCallHistory = results[1].value;
    if (sharedCallPage && sharedCallPage * sharedCallPageSize >= sharedCallHistory.total) { sharedCallPage = 0; return refreshContractorActivity(); }
    renderSharedCallHistory();
  } else {
    document.getElementById("sharedCallHistoryRows").innerHTML = '<div class="history-empty">Call history unavailable. Select Refresh to retry.</div>';
  }
  updateMetrics(document.getElementById("campaignSelect").value);
  renderGoals();
}
let selectedSharedLeadId = "";

function mergeSharedCampaigns() {
  let addedCampaign = false;
  for (const shared of sharedWorkspace.campaigns || []) {
    let campaign = campaigns.find((item) => item.id === shared.id);
    if (!campaign) {
      campaign = { id:shared.id, name:shared.name, status:shared.is_active ? "Active" : "Inactive", sharedManaged:true, leads:0, calls:0, talk:"0m", appointments:0, deals:0, connect:"0%", followups:0 };
      campaigns.push(campaign);
      addedCampaign = true;
    }
    campaign.name = shared.name;
    if (sharedWorkspace.adminMasterSynced) campaign.sharedManaged = true;
    if (campaign.sharedManaged) {
      const summary = (sharedWorkspace.campaignSummaries || []).find((item) => item.campaign_id === shared.id) || {};
      campaign.calls = summary.call_count || 0;
      campaign.appointments = summary.appointment_count || 0;
      campaign.deals = summary.won_count || 0;
    }
    for (const selectId of ["campaignSelect", "settingsGoalCampaign", "commissionCampaign", "sharedCallsCampaign"]) {
      const select = document.getElementById(selectId);
      if (!select) continue;
      let option = [...select.options].find((item) => item.value === shared.id);
      if (!option) {
        option = document.createElement("option");
        option.value = shared.id;
        select.append(option);
      }
      option.textContent = shared.name;
    }
  }
  let nextId = leads.reduce((highest, item) => Math.max(highest, Number(item.id) || 0), -1) + 1;
  const bySharedId = new Map(leads.filter((lead) => lead.sharedLeadId).map((lead) => [lead.sharedLeadId,lead]));
  const byLegacyKey = new Map();
  leads.filter((lead) => !lead.sharedLeadId).forEach((lead) => savedLeadIdentity(lead).forEach((key) => {
    const scopedKey = `${lead.campaign}:${key}`;
    if (!byLegacyKey.has(scopedKey)) byLegacyKey.set(scopedKey, []);
    byLegacyKey.get(scopedKey).push(lead);
  }));
  for (const shared of sharedWorkspace.leads || []) {
    const keys = savedLeadIdentity(shared);
    const candidates = [...new Set(keys.flatMap((key) => byLegacyKey.get(`${shared.campaign_id}:${key}`) || []))].filter((item) => !item.sharedLeadId);
    let lead = bySharedId.get(shared.id)
      || candidates.find((item) => keys.some((key) => key.startsWith("email:") && savedLeadIdentity(item).includes(key)))
      || candidates.find((item) => item.name === shared.name)
      || (candidates.length === 1 ? candidates[0] : null);
    if (lead && (lead.id === activeCallLeadId || (lead.id === selectedIndex && document.getElementById("leadDetail").classList.contains("open")))) {
      Object.assign(lead, {sharedLeadId:shared.id,sharedName:shared.name,sharedNotes:shared.notes || ""});
      continue;
    }
    if (!lead) {
      lead = { id:nextId++, attempts:0, called:false, lastContact:"" };
      leads.push(lead);
    }
    Object.assign(lead, {
      sharedLeadId:shared.id, sharedName:shared.name, sharedNotes:shared.notes || "",
      name:shared.name, campaign:shared.campaign_id, company:shared.company || "—", title:shared.title || "—",
      phone:shared.phone || "—", email:shared.email || "—", linkedin:shared.linkedin_url || "",
      location:shared.location || "—", zone:shared.time_zone || "—", source:shared.source || "Shared import",
      stage:shared.stage, disposition:shared.disposition || "", notes:shared.notes || "",
      industry:String(shared.notes || "").match(/^Industry:\s*(.+)$/im)?.[1]?.trim() || "",
      followAt:shared.next_follow_up_at ? new Date(shared.next_follow_up_at).getTime() : null,
      dnc:shared.stage === "Do Not Call", assignedTo:shared.follow_up_owner_email || null,
      ...(shared.last_call_at ? { called:true, lastContact:new Date(shared.last_call_at).getTime(), attempts:Number(shared.call_count || 1), lastCalledBy:shared.last_called_by } : {}),
    });
    bySharedId.set(shared.id,lead);
  }
  if (sharedWorkspace.adminMasterSynced) {
    const serverIds = new Set(sharedWorkspace.leads.map((lead) => lead.id));
    for (let index = leads.length - 1; index >= 0; index--) {
      if (!serverIds.has(leads[index].sharedLeadId)) leads.splice(index, 1);
    }
    const serverCampaigns = new Set(sharedWorkspace.campaigns.map((campaign) => campaign.id));
    for (let index = campaigns.length - 1; index >= 0; index--) {
      if (!serverCampaigns.has(campaigns[index].id)) campaigns.splice(index, 1);
    }
  }
  campaigns.forEach((campaign) => { campaign.leads = leads.filter((lead) => lead.campaign === campaign.id).length; });
  renderCampaigns();
  renderRows();
  if (addedCampaign) renderContractors();
}
const sharedPipelineColumns = [
  ["appointments", "Booked appointments"],
  ["followups", "Follow-ups"],
  ["pitched", "Pitched"],
  ["won", "Won"],
  ["lost", "Lost"],
];

function formatCommission(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format((Number(cents) || 0) / 100);
}

function sharedPipelineLane(lead) {
  if (lead.pipeline_lane) return lead.pipeline_lane;
  if (lead.deal_status === "won" || lead.stage === "Won") return "won";
  if (lead.deal_status === "lost" || lead.stage === "Lost") return "lost";
  if (lead.stage === "Appointment Set") return "appointments";
  if (lead.stage === "Pitched") return "pitched";
  if (lead.stage === "Contacted" && (lead.disposition === "Connected — follow up" || lead.next_follow_up_at)) return "followups";
  return "appointments";
}

function hasCalendlyAppointment(lead) {
  return lead.pipeline_eligible ?? Number(lead.calendly_appointment_count || 0) > 0;
}

function activityDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString([], { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
}

function renderSharedPipeline() {
  const board = document.getElementById("sharedPipelineBoard");
  if (!board) return;
  const leads = (Array.isArray(sharedWorkspace.leads) ? sharedWorkspace.leads : [])
    .filter(hasCalendlyAppointment);
  board.innerHTML = (sharedWorkspace.pipelineColumns || sharedPipelineColumns).map(([id, label]) => {
    const laneLeads = leads.filter((lead) => sharedPipelineLane(lead) === id);
    return `<section class="shared-pipeline-column" data-shared-pipeline-stage="${id}"><div class="shared-pipeline-column-head"><span>${label}</span><small>${laneLeads.length}</small></div><div class="shared-pipeline-cards">${laneLeads.length ? laneLeads.map((lead) => `<button type="button" class="shared-lead-card" draggable="true" data-shared-lead="${escapeHtml(lead.id)}"><strong>${escapeHtml(lead.name || "Unnamed lead")}</strong><span>${escapeHtml(lead.campaign_name || "")}</span><span>${escapeHtml(lead.last_activity_by ? `Last updated by ${lead.last_activity_by}` : "No activity yet")}</span><span class="commission">Potential ${formatCommission(lead.potential_commission_cents)}</span></button>`).join("") : '<div class="sales-empty">Drop leads here</div>'}</div></section>`;
  }).join("");
  board.querySelectorAll("[data-shared-lead]").forEach((button) => {
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", button.dataset.sharedLead);
    });
    button.onclick = () => openSharedLead(button.dataset.sharedLead);
  });
  board.querySelectorAll("[data-shared-pipeline-stage]").forEach((column) => {
    column.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      column.classList.add("is-over");
    });
    column.addEventListener("dragleave", () => column.classList.remove("is-over"));
    column.addEventListener("drop", (event) => {
      event.preventDefault();
      column.classList.remove("is-over");
      moveSharedLead(event.dataTransfer.getData("text/plain"), column.dataset.sharedPipelineStage);
    });
  });
}

async function requestSharedPipelineUpdate(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to update lead stage");
  return payload;
}

async function moveSharedLead(leadId, lane) {
  const lead = sharedWorkspace.leads.find((item) => item.id === leadId);
  const next = sharedPipelineColumns.find(([id]) => id === lane);
  if (!lead || !next || sharedPipelineLane(lead) === lane) return;

  const [laneId, laneLabel] = next;
  const stageByLane = {
    appointments: "Appointment Set",
    followups: "Contacted",
    pitched: "Pitched",
  };

  try {
    if (laneId === "won" || laneId === "lost") {
      await requestSharedPipelineUpdate("/api/operations/deals", {
        leadId,
        status: laneId,
      });
    } else {
      const nextStage = stageByLane[laneId];
      const wasClosed = lead.deal_status === "won" || lead.deal_status === "lost";
      if (wasClosed) {
        await requestSharedPipelineUpdate("/api/operations/deals", {
          leadId,
          status: "open",
          reopenStage: nextStage,
        });
      }
      if (!wasClosed || laneId === "followups") {
        await requestSharedPipelineUpdate("/api/operations/activities", {
          leadId,
          activityType: "stage_change",
          disposition: laneId === "followups" ? "Connected — follow up" : "",
          note: `Moved to ${laneLabel} from the admin pipeline.`,
          durationSeconds: 0,
          scheduledFor: null,
          nextStage,
        });
      }
    }
    notify(`${lead.name || "Lead"} moved to ${laneLabel}`);
    await loadSharedPipeline({ quiet: true });
    if (selectedSharedLeadId === leadId) await openSharedLead(leadId);
  } catch (error) {
    notify(error.message || "Unable to move lead");
  }
}

function syncCampaignCommissionInputs() {
  const select = document.getElementById("commissionCampaign");
  const input = document.getElementById("campaignCommission");
  if (!select || !input) return;
  const campaign = sharedWorkspace.campaigns.find((item) => item.id === select.value);
  input.value = campaign ? ((Number(campaign.default_commission_cents) || 0) / 100).toFixed(2) : "";
}

function sharedLegacyLead(lead) {
  return {
    campaign: lead.campaign,
    name: lead.name,
    company: lead.company,
    title: lead.title,
    phone: lead.phone,
    email: lead.email,
    linkedin: lead.linkedin,
    location: lead.location,
    zone: lead.zone,
    source: lead.source,
    stage: lead.stage,
    disposition: lead.disposition,
    notes: lead.notes,
    followAt: lead.followAt ? new Date(lead.followAt).toISOString() : null,
    assignedTo: lead.assignedTo || lead.assigned_to || lead.follow_up_owner_email || null,
  };
}

async function recordSharedAdminActivity(lead, activity = {}) {
  if (lead.sharedLeadId) {
    if (lead.name !== lead.sharedName || lead.notes !== lead.sharedNotes) {
      const profileResponse = await fetch(`/api/operations/leads/${encodeURIComponent(lead.sharedLeadId)}`, {
        method:"PATCH", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ name:lead.name, notes:lead.notes || "", previousName:lead.sharedName, previousNotes:lead.sharedNotes }),
      });
      const profile = await profileResponse.json();
      if (!profileResponse.ok) throw new Error(profile.error || "Unable to save lead details");
      lead.sharedName = profile.lead.name;
      lead.sharedNotes = profile.lead.notes;
    }
    if (!activity.activityType) return { lead:{ id:lead.sharedLeadId } };
    const response = await fetch("/api/operations/activities", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ ...activity, leadId:lead.sharedLeadId, note:activity.note === lead.notes ? "" : activity.note }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to save lead activity");
    return result;
  }
  const response = await fetch("/api/operations/admin-legacy-activity", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ lead:sharedLegacyLead(lead), ...activity })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to share lead activity");
  return payload;
}

async function saveSharedAdminDeal(lead, status, reopenStage = "") {
  const resolved = await recordSharedAdminActivity(lead);
  const response = await fetch("/api/operations/deals", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ leadId:resolved.lead.id, status, reopenStage })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to update shared deal");
  return payload;
}

async function loadSharedPipeline({ quiet = false } = {}) {
  try {
    const [response, appointmentsResponse] = await Promise.all([
      fetch("/api/operations/workspace", { cache:"no-store" }),
      fetch("/api/operations/appointments", { cache:"no-store" }),
    ]);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load shared pipeline");
    sharedWorkspace = payload;
    document.getElementById("adminMasterSync").hidden = Boolean(payload.adminMasterSynced);
    mergeSharedCampaigns();
    if (appointmentsResponse.ok) {
      const appointmentPayload = await appointmentsResponse.json();
      sharedAppointments = (appointmentPayload.appointments || [])
        .filter((appointment) => appointment.actor_role === "contractor")
        .map((appointment) => ({
          id: `shared:${appointment.id}`,
          leadId: appointment.lead_id,
          name: appointment.lead_name,
          campaign: appointment.campaign_name,
          type: `Booked by ${appointment.actor_email}`,
          startsAt: appointment.scheduled_for,
          createdAt: appointment.created_at,
        }));
      updateMetrics(activeCampaign);
      renderGoals();
      renderCalendar();
    }
    renderSharedPipeline();
    syncCampaignCommissionInputs();
    if (!quiet) notify("Shared pipeline refreshed");
  } catch (error) {
    const board = document.getElementById("sharedPipelineBoard");
    if (board) board.innerHTML = '<div class="sales-empty">Shared campaign data is temporarily unavailable.</div>';
    if (!quiet) notify(error.message || "Unable to load shared pipeline");
  }
}

async function openSharedLead(leadId) {
  if (!leadId) return;
  try {
    const response = await fetch(`/api/operations/leads/${encodeURIComponent(leadId)}`, { cache:"no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load lead details");
    selectedSharedLeadId = leadId;
    const lead = payload.lead;
    const panel = document.getElementById("sharedLeadDetail");
    document.getElementById("sharedLeadTitle").textContent = `${lead.name || "Lead"} · shared record`;
    document.getElementById("sharedLeadSummary").innerHTML = [
      ["Campaign", lead.campaign_name || "—"],
      ["Deal status", lead.deal_status || "open"],
      ["Potential commission", formatCommission(lead.potential_commission_cents)],
      ["Contact", lead.email || lead.phone || "—"],
      ["Follow-up", lead.next_follow_up_at ? activityDate(lead.next_follow_up_at) : "None scheduled"],
      ["Current stage", lead.stage || "New"]
    ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
    document.getElementById("sharedDealStatus").value = lead.deal_status || "open";
    const assignee = document.getElementById("sharedAssignee");
    const campaign = document.getElementById("sharedAssignmentCampaign");
    assignee.innerHTML = contractors.map((item) => `<option value="${escapeHtml(item.email)}">${escapeHtml(item.name)} · ${escapeHtml(item.email)}</option>`).join("");
    campaign.innerHTML = campaigns.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    campaign.value = lead.campaign_id || "";
    const currentAssignee = String(lead.follow_up_owner_email || "").toLowerCase();
    if ([...assignee.options].some((option) => option.value === currentAssignee)) assignee.value = currentAssignee;
    document.getElementById("sharedAssignmentStatus").textContent = currentAssignee ? `Assigned to ${currentAssignee}` : "Not assigned";
    document.getElementById("sharedDealCommission").value = ((Number(lead.potential_commission_cents) || 0) / 100).toFixed(2);
    document.getElementById("sharedLeadActivityCount").textContent = `${payload.activities.length} activities`;
    document.getElementById("sharedLeadActivities").innerHTML = payload.activities.length ? payload.activities.map((activity) => `<div class="shared-activity"><strong>${escapeHtml(activity.activity_type.replace("_", " "))}</strong> · ${escapeHtml(activity.actor_email || "System")}${activity.note ? `<div>${escapeHtml(activity.note)}</div>` : ""}<small>${activityDate(activity.created_at)}${activity.scheduled_for ? ` · Scheduled ${activityDate(activity.scheduled_for)}` : ""}${activity.resulting_stage ? ` · ${escapeHtml(activity.resulting_stage)}` : ""}</small></div>`).join("") : '<div class="sales-empty">No shared activity yet.</div>';
    panel.hidden = false;
    panel.scrollIntoView({ behavior:"smooth", block:"start" });
  } catch (error) {
    notify(error.message || "Unable to load lead details");
  }
}

document.getElementById("refreshSharedPipeline").onclick = () => loadSharedPipeline();
document.getElementById("reconcileSharedOperations").onclick = async () => {
  const confirmed = window.confirm(
    "Reconcile the current Admin queue with the shared operations service? This writes the current browser queue and its explicit assignments to the shared server."
  );
  if (!confirmed) return;
  const button = document.getElementById("reconcileSharedOperations");
  button.disabled = true;
  button.textContent = "Reconciling…";
  try {
    await syncSharedOperations();
    await loadSharedPipeline({ quiet: true });
    notify("Shared operations reconciliation completed");
  } catch (error) {
    notify(error.message || "Unable to reconcile shared operations");
  } finally {
    button.disabled = false;
    button.textContent = "Reconcile Admin queue";
  }
};

document.getElementById("previewAdminCampaignSync").onclick = async () => {
  const status = document.getElementById("adminSyncStatus");
  const apply = document.getElementById("applyAdminCampaignSync");
  apply.disabled = true;
  try {
    if (!sharedWorkspace.campaigns.length) throw new Error("Refresh the Admin workspace before previewing its queues.");
    adminSyncSnapshot = {
      campaigns:campaigns.map(({id,name}) => ({id,name})),
      leads:leads.map((lead) => ({...sharedLegacyLead(lead),sharedLeadId:lead.sharedLeadId || "",called:lead.called,attempts:lead.attempts,lastContact:lead.lastContact})),
    };
    status.textContent = "Comparing Admin campaign queues…";
    const response = await fetch("/api/operations/admin-campaign-sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...adminSyncSnapshot,preview:true}) });
    adminSyncPreview = await response.json();
    if (!response.ok) throw new Error(adminSyncPreview.error || "Unable to preview Admin queues.");
    status.textContent = adminSyncPreview.campaigns.map((campaign) => `${campaign.name}: ${campaign.shared} shared, ${campaign.candidates} queued`).join(" · ") + ` — ${adminSyncPreview.identity_conflict_count} identity conflicts, ${adminSyncPreview.duplicate_count} duplicate identities, ${adminSyncPreview.invalid_assignment_count} invalid assignments, ${adminSyncPreview.missing_shared_count} shared records missing from this snapshot, ${adminSyncPreview.legacy_call_state_count} browser-only call states needing review.`;
    apply.disabled = !adminSyncPreview.ready;
  } catch (error) { status.textContent = error.message; }
};

document.getElementById("applyAdminCampaignSync").onclick = async () => {
  const button = document.getElementById("applyAdminCampaignSync");
  const status = document.getElementById("adminSyncStatus");
  button.disabled = true;
  try {
    if (!adminSyncSnapshot || !adminSyncPreview?.ready) throw new Error("Preview the Admin queues first.");
    status.textContent = "Backing up and sharing Admin campaign queues…";
    const response = await fetch("/api/operations/admin-campaign-sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...adminSyncSnapshot,previewHash:adminSyncPreview.preview_hash}) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to share Admin queues.");
    await loadSharedPipeline({quiet:true});
    notify("Admin campaigns and BDR queues now share the same lead records.");
  } catch (error) { status.textContent = error.message; button.disabled = false; }
};
document.getElementById("closeSharedLead").onclick = () => {
  selectedSharedLeadId = "";
  document.getElementById("sharedLeadDetail").hidden = true;
};
document.getElementById("sharedAssignmentForm").onsubmit = async (event) => {
  event.preventDefault();
  if (!selectedSharedLeadId) return;
  const status = document.getElementById("sharedAssignmentStatus");
  status.textContent = "Saving assignment…";
  try {
    const response = await fetch(`/api/operations/leads/${encodeURIComponent(selectedSharedLeadId)}/assignment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractorEmail: document.getElementById("sharedAssignee").value, campaignId: document.getElementById("sharedAssignmentCampaign").value })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to save assignment");
    status.textContent = "Assignment saved";
    notify("Lead assignment saved");
    await loadSharedPipeline({ quiet:true });
    await openSharedLead(selectedSharedLeadId);
  } catch (error) {
    status.textContent = error.message || "Unable to save assignment";
  }
};
document.getElementById("sharedDealForm").onsubmit = async (event) => {
  event.preventDefault();
  if (!selectedSharedLeadId) return;
  const amount = document.getElementById("sharedDealCommission").value.trim();
  const potentialCommissionCents = amount === "" ? null : Math.round(Number(amount) * 100);
  if (potentialCommissionCents !== null && (!Number.isFinite(potentialCommissionCents) || potentialCommissionCents < 0)) {
    notify("Enter a valid potential commission");
    return;
  }
  const response = await fetch("/api/operations/deals", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      leadId:selectedSharedLeadId,
      status:document.getElementById("sharedDealStatus").value,
      potentialCommissionCents
    })
  });
  const payload = await response.json();
  if (!response.ok) {
    notify(payload.error || "Unable to save deal");
    return;
  }
  notify("Deal updated");
  await loadSharedPipeline({ quiet:true });
  await openSharedLead(selectedSharedLeadId);
};
document.getElementById("commissionCampaign").onchange = syncCampaignCommissionInputs;
document.getElementById("campaignCommissionForm").onsubmit = async (event) => {
  event.preventDefault();
  const campaignId = document.getElementById("commissionCampaign").value;
  const amount = document.getElementById("campaignCommission").value.trim();
  const commissionCents = Math.round(Number(amount) * 100);
  if (!Number.isFinite(commissionCents) || commissionCents < 0) {
    notify("Enter a valid commission default");
    return;
  }
  const response = await fetch(`/api/operations/campaigns/${encodeURIComponent(campaignId)}`, {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ defaultCommissionCents:commissionCents })
  });
  const payload = await response.json();
  if (!response.ok) {
    notify(payload.error || "Unable to save commission default");
    return;
  }
  sharedWorkspace.campaigns = sharedWorkspace.campaigns.map((campaign) => campaign.id === payload.campaign.id ? { ...campaign, ...payload.campaign } : campaign);
  syncCampaignCommissionInputs();
  notify("Campaign commission default saved");
};

const adminViewRoutes = {
  operations: "homeView",
  contractors: "contractorsView",
  pipeline: "boardView",
  leads: "leadsView",
  configuration: "settingsView",
};

function viewFromLocation() {
  return adminViewRoutes[window.location.hash.slice(1).toLowerCase()] || "homeView";
}

function showView(viewId, { updateLocation = true } = {}) {
  if (!Object.values(adminViewRoutes).includes(viewId)) viewId = "homeView";
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  if (viewId === "homeView") closeDetail();
  if (viewId === "contractorsView" && !editingContractorEmail) loadContractors();
  if (viewId === "boardView") loadSharedPipeline({ quiet:true });
  if (viewId === "settingsView") loadSharedPipeline({ quiet:true });
  if (updateLocation) {
    const route = Object.entries(adminViewRoutes).find(([, target]) => target === viewId)?.[0] || "operations";
    const nextHash = `#${route}`;
    if (window.location.hash !== nextHash) history.pushState(null, "", nextHash);
  }
}

window.addEventListener("popstate", () => showView(viewFromLocation(), { updateLocation:false }));
window.addEventListener("hashchange", () => showView(viewFromLocation(), { updateLocation:false }));

function updateTimezoneMap() {
  const zones = [
    ["PT", "America/Los_Angeles"], ["MT", "America/Denver"],
    ["CT", "America/Chicago"], ["ET", "America/New_York"]
  ];
  let nextZone = zoneOrder()[0];
  zones.forEach(([zone, timeZone]) => {
    const time = new Intl.DateTimeFormat([], { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date());
    const timeEl = document.querySelector(`[data-time-zone="${zone}"]`);
    const active = zone === nextZone;
    timeEl.querySelector("span").textContent = time;
    timeEl.classList.toggle("active", active);
    document.querySelectorAll(`[data-map-zone="${zone}"]`).forEach((element) => element.classList.toggle("active", active));
  });
  document.getElementById("mapStatus").textContent = `${nextZone} leads prioritized`;
}

function updateMetrics(campaignId) {
  const campaign = campaigns.find((item) => item.id === campaignId);
  let range;
  try { range = currentReportRange(); } catch { return; }
  const pacificDate = new Intl.DateTimeFormat("en-CA", { timeZone:"America/Los_Angeles", year:"numeric", month:"2-digit", day:"2-digit" });
  const matchesDate = (value) => {
    if (!value || Number.isNaN(new Date(value).valueOf())) return false;
    const day = pacificDate.format(new Date(value));
    return day >= range.from && day <= range.to;
  };
  const matchesScope = (campaignName) => statsMode === "overall" || campaignName === campaign.name;
  const dailyCalls = callLog.filter((entry) => new Date(entry.at).getTime() >= statsResetAt && matchesDate(entry.at) && matchesScope(entry.campaign));
  const dailyAppointments = [...appointments, ...sharedAppointments].filter((entry) => matchesDate(entry.createdAt) && matchesScope(entry.campaign));
  const dailyDeals = leads.filter((lead) => lead.stage === "Won" && matchesDate(lead.wonAt) && (statsMode === "overall" || lead.campaign === campaign.id));
  const dailyFollowups = leads.filter((lead) => matchesDate(lead.followAt) && (statsMode === "overall" || lead.campaign === campaign.id));
  const connected = dailyCalls.filter((entry) => ["Connected — qualified", "Connected — follow up"].includes(entry.disposition)).length;
  const talkSeconds = dailyCalls.reduce((total, entry) => total + Number(entry.duration || 0), 0);
  const shared = contractorReport?.key === contractorReportKey() ? contractorReport.totals : { calls:0, connected:0, talk_seconds:0 };
  const totalCalls = dailyCalls.length + shared.calls;
  const stats = { calls:totalCalls, talk:formatTalkTime(talkSeconds + shared.talk_seconds), appointments:dailyAppointments.length, deals:dailyDeals.length, followups:dailyFollowups.length, connect:totalCalls ? `${Math.round(((connected + shared.connected) / totalCalls) * 100)}%` : "0%" };
  const dateLabel = reportRangeLabel(range);
  document.getElementById("campaignStatsTitle").textContent = `${statsMode === "overall" ? "All campaigns" : campaign.name} · ${dateLabel}`;
  document.getElementById("metricCalls").textContent = stats.calls;
  document.getElementById("metricTalk").textContent = stats.talk;
  document.getElementById("metricAppointments").textContent = stats.appointments;
  document.getElementById("metricDeals").textContent = stats.deals;
  document.getElementById("metricConnect").textContent = stats.connect;
  document.getElementById("metricFollowups").textContent = stats.followups;
  document.getElementById("showCampaignStats").classList.toggle("active", statsMode === "campaign");
  document.getElementById("showOverallStats").classList.toggle("active", statsMode === "overall");
}

function goalProgress(value, goal) {
  return goal > 0 ? Math.min(100, Math.round(value / goal * 100)) : 0;
}

function renderGoals() {
  const campaign = campaigns.find((item) => item.id === document.getElementById("campaignSelect").value) || campaigns[0];
  const today = new Date().toDateString();
  let reportKey;
  try { reportKey = contractorReportKey(); } catch {}
  const sharedCallsToday = contractorReport?.key === reportKey && statsMode === "campaign" && contractorReport.from === contractorReport.to && new Date(`${contractorReport.from}T12:00:00`).toDateString() === today ? contractorReport.totals.calls : 0;
  const callsToday = sharedCallsToday + callLog.filter((entry) => entry.campaign === campaign.name && new Date(entry.at).getTime() >= statsResetAt && new Date(entry.at).toDateString() === today).length;
  const appointmentsToday = [...appointments, ...sharedAppointments].filter((entry) => entry.campaign === campaign.name && entry.createdAt && new Date(entry.createdAt).toDateString() === today).length;
  const callGoal = (goals.callGoals || {})[campaign.id] ?? 120;
  const appointmentGoal = (goals.appointmentGoals || {})[campaign.id] ?? 0;
  const closeRatio = (goals.closeRatios || {})[campaign.id] ?? goals.closeRatio ?? 0;
  const values = [
    ["callGoalValue", "callGoalProgress", callsToday, callGoal, ""],
    ["appointmentGoalValue", "appointmentGoalProgress", appointmentsToday, appointmentGoal, ""],
    ["closeGoalValue", "closeGoalProgress", closeRatio, 100, "%"]
  ];
  values.forEach(([valueId, progressId, value, goal, suffix]) => {
    document.getElementById(valueId).textContent = valueId === "closeGoalValue" ? (value ? `${value}%` : "Not entered") : `${value}${suffix} / ${goal}${suffix}`;
    document.getElementById(progressId).style.width = `${goalProgress(value, goal)}%`;
  });
  document.getElementById("goalScope").textContent = `${campaign.name} · daily goals`;
  document.getElementById("settingsGoalCampaign").value = campaign.id;
  document.getElementById("callGoalInput").value = callGoal;
  document.getElementById("appointmentGoalInput").value = appointmentGoal;
  document.getElementById("closeGoalInput").value = closeRatio;
}

function renderMiningProfile(campaignId) {
  const profile = leadMiningProfiles[campaignId];
  const panel = document.getElementById("miningProfilePanel");
  panel.hidden = !profile;
  if (!profile) return;
  const campaign = campaigns.find((item) => item.id === campaignId);
  document.getElementById("miningProfileCampaign").textContent = campaign?.name || "";
  document.getElementById("miningProfileBody").innerHTML = `<p>${escapeHtml(profile.qualification)}</p><strong>Target verticals</strong><ul>${profile.verticals.map((vertical) => `<li>${escapeHtml(vertical)}</li>`).join("")}</ul><strong>Buyer titles</strong><p>${profile.titles.map(escapeHtml).join(" · ")}</p>`;
}

function renderCampaigns() {
  document.getElementById("campaignCount").textContent = `${campaigns.length} active`;
  document.getElementById("campaignRows").innerHTML = campaigns.map((campaign) => {
    const sharedAppointmentCount = campaign.sharedManaged ? 0 : sharedAppointments.filter((appointment) => appointment.campaign === campaign.name).length;
    return `<div class="campaign-row" data-campaign-row="${campaign.id}" role="button" tabindex="0"><span><strong>${escapeHtml(campaign.name)}</strong><small>${escapeHtml(campaign.status)}</small></span><span>${campaign.leads} leads</span><span>${campaign.calls} calls</span><span>${campaign.appointments + sharedAppointmentCount} appts</span><span>${campaign.deals} won</span><button data-campaign="${campaign.id}">Open</button></div>`;
  }).join("");
  document.querySelectorAll("[data-campaign-row]").forEach((row) => {
    const open = () => openCampaign(row.dataset.campaignRow);
    row.onclick = (event) => { if (event.target.closest("button")) return; open(); };
    row.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } };
  });
  document.querySelectorAll("[data-campaign]").forEach((button) => {
    button.onclick = (event) => { event.stopPropagation(); openCampaign(button.dataset.campaign); };
  });
}

function openSearchResult(query) {
  const term = query.trim().toLowerCase();
  if (!term) return;
  const match = leads.find((lead) => [lead.name, lead.company, lead.phone, lead.email].some((value) => String(value ?? "").toLowerCase().includes(term)));
  if (!match) {
    notify("No matching lead");
    return;
  }
  activeCampaign = match.campaign;
  document.getElementById("campaignSelect").value = activeCampaign;
  const campaign = campaigns.find((item) => item.id === activeCampaign);
  document.getElementById("currentCampaignTitle").textContent = `${campaign.name} · prioritized leads`;
  updateMetrics(activeCampaign);
  const queueIndex = orderedLeads().findIndex((lead) => lead.id === match.id);
  currentPage = Math.max(0, Math.floor(queueIndex / pageSize));
  showView("leadsView");
  selectLead(match.id);
}

function openCampaign(campaignId) {
  activeCampaign = campaignId;
  const campaign = campaigns.find((item) => item.id === campaignId);
  document.getElementById("campaignSelect").value = campaignId;
  document.getElementById("currentCampaignTitle").textContent = `${campaign.name} · prioritized leads`;
  updateMetrics(campaignId);
  renderGoals();
  selectedIndex = -1;
  document.getElementById("leadDetail").classList.remove("open");
  document.getElementById("leadDetail").setAttribute("aria-hidden", "true");
  currentPage = 0;
  renderRows();
  showView("leadsView");
}

function zoneOrder() {
  const hour = new Date().getHours();
  if (hour < 9) return ["ET", "CT", "MT", "PT"];
  if (hour < 11) return ["CT", "ET", "MT", "PT"];
  if (hour < 13) return ["MT", "CT", "PT", "ET"];
  return ["PT", "MT", "CT", "ET"];
}

function orderedLeads() {
  const now = Date.now();
  const zones = zoneOrder();
  const zone = document.getElementById("filterZone").value;
  const stage = document.getElementById("filterStage").value;
  const disposition = document.getElementById("filterDisposition").value;
  const lastContact = document.getElementById("filterLastContact").value;
  return leads.filter((lead) => lead.campaign === activeCampaign && !lead.called && !lead.dnc && (!zone || lead.zone === zone) && (!stage || lead.stage === stage) && (!disposition || lead.disposition === disposition) && (!lastContact || lead.lastContact === lastContact)).sort((a, b) => {
    // Work the original Parsity School list before subsequently imported batches.
    if (activeCampaign === "school") {
      const schoolBatchPriority = (lead) => lead.source === "Workbook import" ? 0 : lead.source === "CSV import" ? 1 : lead.source === "Apollo CSV import · #17 merge" ? 2 : 1;
      const batchDiff = schoolBatchPriority(a) - schoolBatchPriority(b);
      if (batchDiff) return batchDiff;
    }
    // Keep the newly researched batch after the existing campaign leads.
    const aNew = a.source === "Official website research";
    const bNew = b.source === "Official website research";
    if (aNew !== bNew) return aNew ? 1 : -1;
    if (activeCampaign === "business") {
      const aHasPhone = a.phone && a.phone !== "—";
      const bHasPhone = b.phone && b.phone !== "—";
      if (aHasPhone !== bHasPhone) return aHasPhone ? -1 : 1;
    }
    const aDue = a.followAt !== null && a.followAt <= now;
    const bDue = b.followAt !== null && b.followAt <= now;
    if (aDue !== bDue) return aDue ? -1 : 1;
    if (aDue && bDue) return a.followAt - b.followAt;
    const zoneDiff = zones.indexOf(a.zone) - zones.indexOf(b.zone);
    if (zoneDiff) return zoneDiff;
    const aFollow = a.followAt ?? Infinity;
    const bFollow = b.followAt ?? Infinity;
    return aFollow - bFollow || a.name.localeCompare(b.name);
  });
}

function followLabel(lead) {
  if (lead.followAt === null) return "—";
  const minutes = Math.round((lead.followAt - Date.now()) / 60000);
  if (minutes <= 0) return `Due ${Math.abs(minutes)}m`;
  if (minutes < 60) return `In ${minutes}m`;
  return `In ${Math.round(minutes / 60)}h`;
}

function renderRows() {
  const ordered = orderedLeads();
  const start = currentPage * pageSize;
  const page = ordered.slice(start, start + pageSize);
  const zones = zoneOrder();
  const rows = document.getElementById("leadRows");
  if (!page.length) {
    rows.innerHTML = '<div class="empty-state">No leads match this queue.</div>';
  } else {
    rows.innerHTML = page.map((lead, index) => {
      const due = lead.followAt !== null && lead.followAt <= Date.now();
      return `<button class="grid grid-row ${lead.id === selectedIndex ? "active" : ""} ${start + index === 0 ? "next" : ""}" data-index="${lead.id}"><span class="row-number">${start + index + 1}</span><span class="name">${escapeHtml(lead.name)}</span><span>${escapeHtml(lead.company)}</span><span>${escapeHtml(formatPhone(lead.phone))}</span><span>${escapeHtml(lead.zone)}</span><span class="${due ? "due" : ""}">${followLabel(lead)}</span><span class="status">${escapeHtml(lead.stage)}</span></button>`;
    }).join("");
  }
  document.querySelectorAll(".grid-row").forEach((row) => {
    row.onclick = () => selectLead(Number(row.dataset.index));
  });
  document.getElementById("pageStatus").textContent = ordered.length ? `${start + 1}–${Math.min(start + pageSize, ordered.length)} of ${ordered.length}` : "0 leads";
  document.getElementById("previousPage").disabled = currentPage === 0;
  document.getElementById("nextPage").disabled = start + pageSize >= ordered.length;
  const dueCount = ordered.filter((lead) => lead.followAt !== null && lead.followAt <= Date.now()).length;
  document.getElementById("queueSummary").textContent = ordered.length ? (dueCount ? `${dueCount} follow-up${dueCount > 1 ? "s" : ""} due · 20 per page` : `${zones[0]} leads prioritized · 20 per page`) : "No leads";
}

function selectLead(index) {
  selectedIndex = index;
  const lead = getLead(index);
  if (!lead) return;
  const detail = document.getElementById("leadDetail");
  document.getElementById("detailName").textContent = lead.name;
  document.getElementById("detailNameInput").value = lead.name;
  document.getElementById("detailNameInput").hidden = true;
  document.getElementById("detailName").hidden = false;
  document.getElementById("editContactName").textContent = "Edit name";
  document.getElementById("detailRole").textContent = lead.title === "—" && lead.company === "—" ? "Parsity School lead" : `${lead.title} · ${lead.company}`;
  document.getElementById("detailCompany").textContent = lead.company;
  document.getElementById("detailIndustry").value = lead.industry || "";
  document.getElementById("detailTitle").textContent = lead.title;
  document.getElementById("detailPhone").textContent = formatPhone(lead.phone);
  document.getElementById("detailEmail").textContent = lead.email;
  document.getElementById("detailLocation").textContent = lead.zone;
  document.getElementById("detailSource").textContent = campaigns.find((campaign) => campaign.id === lead.campaign)?.name || "—";
  document.getElementById("detailStage").value = lead.stage;
  document.getElementById("detailAttempts").textContent = `${lead.attempts || 0}`;
  document.getElementById("doNotCall").checked = Boolean(lead.dnc);
  const callButton = document.getElementById("callLead");
  callButton.disabled = Boolean(lead.dnc);
  callButton.textContent = lead.dnc ? "Do not call" : "Call lead";
  const linkedin = document.getElementById("detailLinkedin");
  const linkedinUrl = normalizeLinkedInUrl(lead.linkedin);
  linkedin.textContent = linkedinUrl ? "View LinkedIn profile ↗" : "No LinkedIn profile";
  linkedin.href = linkedinUrl || "#";
  linkedin.toggleAttribute("aria-disabled", !linkedinUrl);
  linkedin.onclick = (event) => { if (!linkedinUrl) event.preventDefault(); };
  document.getElementById("notes").value = lead.notes;
  document.getElementById("disposition").value = lead.disposition || "";
  const customScript = String(lead.notes || "").match(/(?:^|\n)Call script:\s*\n?([\s\S]*?)(?=\n(?:Source|Verified|Industry):|$)/i)?.[1]?.trim();
  const script = callScripts[lead.campaign] || (lead.campaign.startsWith("onyx-review-") ? callScripts.reviews : callScripts.school);
  document.getElementById("scriptCampaign").textContent = campaigns.find((campaign) => campaign.id === lead.campaign)?.name || "";
  document.getElementById("callScript").innerHTML = customScript ? escapeHtml(customScript).replace(/\n/g, "<br>") : `<strong>Opening</strong>${escapeHtml(script.opener)}<strong>Qualifying questions</strong>${escapeHtml(script.questions)}<strong>Objections</strong>${escapeHtml(script.objections)}`;
  renderLeadHistory(lead);
  renderCompanyOverview(lead);
  renderCompanyIntelligence(lead);
  document.getElementById("appointmentConfirmation").classList.remove("show");
  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");
  renderRows();
}

function closeDetail() {
  selectedIndex = -1;
  clearInterval(callInterval);
  document.getElementById("callState").classList.remove("show");
  const detail = document.getElementById("leadDetail");
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden", "true");
  renderRows();
}

document.getElementById("closeDetail").onclick = closeDetail;
document.getElementById("editContactName").onclick = () => {
  const input = document.getElementById("detailNameInput");
  const heading = document.getElementById("detailName");
  const editing = !input.hidden;
  if (editing) {
    const name = input.value.trim();
    if (!name) { notify("Enter a contact name"); input.focus(); return; }
    heading.textContent = name;
    heading.hidden = false;
    input.hidden = true;
    document.getElementById("editContactName").textContent = "Edit name";
    return;
  }
  heading.hidden = true;
  input.hidden = false;
  input.focus();
  input.select();
  document.getElementById("editContactName").textContent = "Done";
};
document.getElementById("detailNameInput").onkeydown = (event) => {
  if (event.key === "Enter") { event.preventDefault(); document.getElementById("editContactName").click(); }
};
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeDetail(); if (typeof closeCalendlyScheduler === "function") closeCalendlyScheduler(); if (typeof closeCallDetails === "function") closeCallDetails(); } });
document.getElementById("callLead").onclick = () => {
  const lead = getLead(selectedIndex);
  const campaign = campaigns.find((item) => item.id === lead.campaign);
  if (lead.dnc) { notify("This lead is marked Do Not Call"); return; }
  if (activeCallLeadId === lead.id) return;
  clearInterval(callInterval);
  callSeconds = 0;
  activeCallLeadId = lead.id;
  lead.called = true;
  lead.attempts += 1;
  lead.stage = lead.stage === "New" ? "Contacted" : lead.stage;
  lead.lastContact = new Date().toISOString().slice(0,10);
  callLog.push({ leadId: lead.id, name: lead.name, phone: lead.phone, campaign: campaigns.find((item) => item.id === lead.campaign)?.name || "—", at: new Date().toISOString(), duration: 0, disposition: "", note: "", appointment: "" });
  campaign.calls += 1;
  updateConnectRate(campaign);
  persistActivity();
  refreshActivityViews();
  document.getElementById("callState").classList.add("show");
  callInterval = setInterval(() => {
    callSeconds += 1;
    document.getElementById("callTimer").textContent = `Live call · ${String(Math.floor(callSeconds / 60)).padStart(2, "0")}:${String(callSeconds % 60).padStart(2, "0")}`;
  }, 1000);
  notify(`Calling ${lead.name}`);
};
document.getElementById("endCall").onclick = () => {
  clearInterval(callInterval);
  const lead = leads.find((item) => item.id === activeCallLeadId);
  const campaign = lead && campaigns.find((item) => item.id === lead.campaign);
  if (campaign) {
    campaign.talkSeconds = (campaign.talkSeconds || 0) + callSeconds;
    campaign.talk = formatTalkTime(campaign.talkSeconds);
    const latest = [...callLog].reverse().find((entry) => entry.leadId === lead.id);
    if (latest) latest.duration = callSeconds;
    persistActivity();
    refreshActivityViews();
    recordSharedAdminActivity(lead, {
      activityType:"call",
      disposition:lead.disposition,
      note:latest?.note || "",
      durationSeconds:callSeconds,
      scheduledFor:lead.followAt ? new Date(lead.followAt).toISOString() : null,
      nextStage:lead.stage
    }).then(() => loadSharedPipeline({ quiet:true })).catch((error) => {
      notify(`${error.message || "Unable to sync call"} · call retained in this browser`);
    });
  }
  activeCallLeadId = null;
  document.getElementById("callState").classList.remove("show");
  notify("Call ended");
};
const leadTimeZones = { ET: "America/New_York", CT: "America/Chicago", MT: "America/Denver", PT: "America/Los_Angeles" };
const leadZoneNames = { ET: "Eastern", CT: "Central", MT: "Mountain", PT: "Pacific" };
let calendlyTimeContextTimer;

function formatZoneTime(timeZone) {
  return new Intl.DateTimeFormat([], { timeZone, weekday:"short", hour:"numeric", minute:"2-digit", timeZoneName:"short" }).format(new Date());
}

function updateCalendlyTimeContext(lead) {
  const prospectZone = leadTimeZones[lead.zone] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const repZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById("prospectLocalTime").textContent = formatZoneTime(prospectZone);
  document.getElementById("repLocalTime").textContent = formatZoneTime(repZone);
}

document.getElementById("toggleScheduler").onclick = () => {
  const lead = getLead(selectedIndex);
  if (!lead) return;
  const calendlyUrl = "https://calendly.com/softwaresmitty/discovery";
  if (calendlyUrl) {
    document.getElementById("calendlyTitle").textContent = `Book with ${lead.name}`;
    document.getElementById("calendlyTimezone").textContent = `${leadZoneNames[lead.zone] || lead.zone || "Prospect"} prospect · Calendly displays live times in your local time`;
    updateCalendlyTimeContext(lead);
    clearInterval(calendlyTimeContextTimer);
    calendlyTimeContextTimer = setInterval(() => updateCalendlyTimeContext(lead), 30000);
    const container = document.getElementById("calendlyInline");
    container.replaceChildren();
    if (!window.Calendly) { notify("Calendly is still loading — please try again"); return; }
    window.Calendly.initInlineWidget({
      url: `${calendlyUrl}?hide_event_type_details=1`,
      parentElement: container,
      prefill: {
        name: lead.name === "—" ? "" : lead.name,
        email: lead.email === "—" ? "" : lead.email,
        customAnswers: { a1: lead.phone === "—" ? "" : lead.phone }
      },
      utm: { utmSource:"onyx-dialer", utmCampaign:lead.campaign }
    });
    document.getElementById("calendlyModal").classList.add("open");
    document.getElementById("calendlyModal").setAttribute("aria-hidden", "false");
    return;
  }
  const scheduler = document.getElementById("scheduler");
  scheduler.classList.toggle("open");
  if (scheduler.classList.contains("open")) setTimeout(() => document.getElementById("meetingType").focus(), 50);
};
function closeCalendlyScheduler() {
  clearInterval(calendlyTimeContextTimer);
  document.getElementById("calendlyModal").classList.remove("open");
  document.getElementById("calendlyModal").setAttribute("aria-hidden", "true");
  document.getElementById("calendlyInline").replaceChildren();
}
document.getElementById("closeCalendly").onclick = closeCalendlyScheduler;
document.getElementById("calendlyModal").onclick = (event) => { if (event.target.id === "calendlyModal") closeCalendlyScheduler(); };
document.getElementById("closeCallDetails").onclick = closeCallDetails;
document.getElementById("callDetailsModal").onclick = (event) => { if (event.target.id === "callDetailsModal") closeCallDetails(); };
window.addEventListener("message", (event) => {
  if (event.origin !== "https://calendly.com" || event.data?.event !== "calendly.event_scheduled") return;
  const lead = getLead(selectedIndex);
  if (!lead) return;
  const calendlyEvent = event.data.payload?.event?.uri || event.data.payload?.invitee?.uri || "";
  if (calendlyEvent && appointments.some((appointment) => appointment.calendlyEvent === calendlyEvent)) return;
  const campaign = campaigns.find((item) => item.id === lead.campaign);
  lead.disposition = "Connected — follow up";
  lead.stage = "Appointment Set";
  campaign.appointments += 1;
  appointments.push({ leadId:lead.id, name:lead.name, campaign:campaign.name, type:"Calendly appointment", startsAt:null, createdAt:new Date().toISOString(), calendlyEvent });
  const latest = [...callLog].reverse().find((entry) => entry.leadId === lead.id);
  if (latest) { latest.disposition = lead.disposition; latest.appointment = "Confirmed in Calendly"; }
  updateConnectRate(campaign);
  persistActivity();
  refreshActivityViews();
  recordSharedAdminActivity(lead, {
    activityType:"appointment",
    disposition:lead.disposition,
    note:"Calendly appointment confirmed",
    scheduledFor:null,
    nextStage:"Appointment Set"
  }).then(() => loadSharedPipeline({ quiet:true })).catch((error) => {
    notify(`${error.message || "Unable to sync appointment"} · appointment retained in this browser`);
  });
  closeCalendlyScheduler();
  notify("Appointment confirmed in Calendly");
});
document.getElementById("bookAppointment").onclick = () => {
  const type = document.getElementById("meetingType").value;
  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("appointmentTime").value;
  const duration = document.getElementById("duration").value;
  if (!date || !time) { notify("Choose a date and time"); return; }
  const startsAt = `${date}T${time}`;
  if (appointments.some((appointment) => appointment.startsAt === startsAt)) { notify("That time is already booked"); return; }
  const formatted = new Date(`${date}T${time}`).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const confirmation = document.getElementById("appointmentConfirmation");
  confirmation.textContent = `${type} booked · ${formatted} · ${duration} min`;
  confirmation.classList.add("show");
  document.getElementById("disposition").value = "Connected — follow up";
  const lead = getLead(selectedIndex);
  const campaign = campaigns.find((item) => item.id === lead.campaign);
  campaign.appointments += 1;
  lead.disposition = "Connected — follow up";
  lead.stage = "Appointment Set";
  appointments.push({ leadId: lead.id, name: lead.name, campaign: campaign.name, type, startsAt, duration, createdAt: new Date().toISOString() });
  const latest = [...callLog].reverse().find((entry) => entry.leadId === lead.id);
  if (latest) { latest.appointment = `${type} · ${formatted}`; latest.disposition = lead.disposition; }
  updateConnectRate(campaign);
  persistActivity();
  refreshActivityViews();
  recordSharedAdminActivity(lead, {
    activityType:"appointment",
    disposition:lead.disposition,
    note:`${type} booked`,
    scheduledFor:new Date(startsAt).toISOString(),
    nextStage:"Appointment Set"
  }).then(() => loadSharedPipeline({ quiet:true })).catch((error) => {
    notify(`${error.message || "Unable to sync appointment"} · appointment retained in this browser`);
  });
  notify("Appointment booked");
};
let noteTimer;
document.getElementById("notes").oninput = () => {
  document.getElementById("saved").textContent = "Saving…";
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => {
    const lead = getLead(selectedIndex);
    if (lead) lead.notes = document.getElementById("notes").value;
    document.getElementById("saved").textContent = lead?.sharedLeadId ? "Save lead to sync changes" : "Saved";
    persistActivity();
  }, 500);
};
document.getElementById("previousPage").onclick = () => { if (currentPage > 0) { currentPage -= 1; renderRows(); } };
document.getElementById("nextPage").onclick = () => { if ((currentPage + 1) * pageSize < orderedLeads().length) { currentPage += 1; renderRows(); } };
document.getElementById("saveLead").onclick = async () => {
  const lead = getLead(selectedIndex);
  const editedName = document.getElementById("detailNameInput").hidden ? document.getElementById("detailName").textContent.trim() : document.getElementById("detailNameInput").value.trim();
  if (!editedName) { notify("Enter a contact name before saving"); return; }
  lead.name = editedName;
  lead.industry = document.getElementById("detailIndustry").value.trim();
  const campaign = campaigns.find((item) => item.id === lead.campaign);
  const wasWon = lead.stage === "Won";
  const wasClosedDeal = lead.stage === "Won" || lead.stage === "Lost";
  const disposition = document.getElementById("disposition").value;
  if (disposition && disposition !== lead.disposition) {
    lead.disposition = disposition;
  }
  lead.stage = document.getElementById("detailStage").value;
  lead.dnc = document.getElementById("doNotCall").checked;
  if (lead.dnc) lead.stage = "Do Not Call";
  if (!wasWon && lead.stage === "Won") { campaign.deals += 1; lead.wonAt = Date.now(); playCelebration(); }
  if (wasWon && lead.stage !== "Won") { campaign.deals = Math.max(0, campaign.deals - 1); lead.wonAt = null; }
  const followUp = document.getElementById("followUp").value;
  lead.followAt = followUp ? new Date(`${followUp}T09:00:00`).getTime() : null;
  const latest = [...callLog].reverse().find((entry) => entry.leadId === lead.id);
  if (latest) { latest.disposition = lead.disposition; latest.note = lead.notes; }
  updateConnectRate(campaign);
  updateFollowups(campaign);
  persistActivity();
  refreshActivityViews();
  const sharedSave = lead.stage === "Won" || lead.stage === "Lost"
    ? saveSharedAdminDeal(lead, lead.stage === "Won" ? "won" : "lost")
    : wasClosedDeal
      ? saveSharedAdminDeal(lead, "open", lead.stage)
      : recordSharedAdminActivity(lead, {
        activityType:"stage_change",
        disposition:lead.disposition,
        note:lead.notes,
        scheduledFor:lead.followAt ? new Date(lead.followAt).toISOString() : null,
        nextStage:lead.stage
      });
  try {
    await sharedSave;
    await loadSharedPipeline({ quiet:true });
  } catch (error) {
    if (!sharedWorkspace.adminMasterSynced) closeDetail();
    notify(sharedWorkspace.adminMasterSynced ? `${error.message || "Unable to sync lead"} · keep this lead open and retry` : `${error.message || "Unable to sync lead"} · saved in this browser`);
    return;
  }
  closeDetail();
  notify(`${lead.name} saved`);
};
document.querySelectorAll(".nav-button").forEach((button) => { button.onclick = () => showView(button.dataset.view); });
document.getElementById("showContractorForm").onclick = () => openContractorForm();
document.getElementById("cancelContractor").onclick = () => {
  const form = document.getElementById("contractorForm");
  form.reset();
  document.getElementById("contractorEmail").disabled = false;
  editingContractorEmail = "";
  form.hidden = true;
};
document.getElementById("contractorForm").onsubmit = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.getElementById("contractorName").value.trim();
  const email = document.getElementById("contractorEmail").value.trim().toLowerCase();
  const phone = document.getElementById("contractorPhone").value.trim();
  const dailyCallGoal = document.getElementById("contractorCallGoal").value;
  const dailyAppointmentGoal = document.getElementById("contractorAppointmentGoal").value;
  const notes = document.getElementById("contractorNotes").value.trim();
  const selectedCampaigns = [...document.querySelectorAll('input[name="contractorCampaign"]:checked')].map((input) => input.value);
  const inviteButton = document.getElementById("sendContractorInvite");
  if (!selectedCampaigns.length) { notify("Choose at least one campaign"); return; }
  inviteButton.disabled = true;
  inviteButton.textContent = "Sending invite…";
  try {
    const response = await fetch("/api/admin/contractors", {
      method: editingContractorEmail ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: editingContractorEmail || email, phone, notes, campaigns: selectedCampaigns, dailyCallGoal, dailyAppointmentGoal }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to send the invitation");
    contractors = [payload.contractor, ...contractors.filter((contractor) => contractor.email !== payload.contractor.email)];
    renderContractors();
    form.reset();
    document.getElementById("contractorEmail").disabled = false;
    const updatedExisting = Boolean(editingContractorEmail);
    editingContractorEmail = "";
    form.hidden = true;
    notify(updatedExisting
      ? (payload.campaignNoticeSent ? `${name} updated — campaign-access email sent` : `${name} updated`)
      : `${name} invited — secure sign-in link sent`);
  } catch (error) {
    notify(error.message || "Unable to send the invitation");
    await loadContractors();
  } finally {
    inviteButton.disabled = false;
    inviteButton.textContent = editingContractorEmail ? "Save changes" : "Send invite";
  }
};
document.getElementById("campaignSelect").onchange = (event) => { sharedCallPage = 0; updateMetrics(event.target.value); renderGoals(); refreshContractorActivity(); };
document.getElementById("settingsGoalCampaign").onchange = (event) => {
  document.getElementById("campaignSelect").value = event.target.value;
  updateMetrics(event.target.value);
  renderGoals();
  renderMiningProfile(event.target.value);
  sharedCallPage = 0; refreshContractorActivity();
};
document.getElementById("showCampaignStats").onclick = () => { statsMode = "campaign"; sharedCallPage = 0; updateMetrics(document.getElementById("campaignSelect").value); refreshContractorActivity(); };
document.getElementById("showOverallStats").onclick = () => { statsMode = "overall"; sharedCallPage = 0; updateMetrics(document.getElementById("campaignSelect").value); refreshContractorActivity(); };
document.getElementById("statsDate").onchange = () => { updateMetrics(document.getElementById("campaignSelect").value); refreshContractorActivity(); };
document.getElementById("statsPeriod").onchange = () => { updateMetrics(document.getElementById("campaignSelect").value); refreshContractorActivity(); };
document.getElementById("sharedCallsCampaign").onchange = () => { sharedCallPage = 0; refreshContractorActivity(); };
document.getElementById("refreshContractorActivity").onclick = () => refreshContractorActivity();
document.getElementById("sharedCallsPrevious").onclick = () => { sharedCallPage = Math.max(0, sharedCallPage - 1); refreshContractorActivity(); };
document.getElementById("sharedCallsNext").onclick = () => { sharedCallPage++; refreshContractorActivity(); };
document.getElementById("openCampaign").onclick = () => openCampaign(document.getElementById("campaignSelect").value);
document.getElementById("leadSearch").onkeydown = (event) => { if (event.key === "Enter") openSearchResult(event.currentTarget.value); };
document.getElementById("toggleCallHistory").onclick = () => {
  const panel = document.getElementById("callHistoryPanel");
  panel.hidden = !panel.hidden;
  document.getElementById("toggleCallHistory").textContent = panel.hidden ? "View Admin call history" : "Hide Admin call history";
};
document.getElementById("toggleCalendar").onclick = () => {
  const panel = document.getElementById("calendarPanel");
  panel.hidden = !panel.hidden;
  document.getElementById("toggleCalendar").textContent = panel.hidden ? "Appointment calendar" : "Hide calendar";
};
document.getElementById("appointmentsMetricCard").onclick = openAppointments;
document.getElementById("appointmentsMetricCard").onkeydown = (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openAppointments(); }
};
document.getElementById("calendarRange").onchange = renderCalendar;
document.getElementById("toggleComparison").onclick = () => {
  const panel = document.getElementById("comparisonPanel");
  panel.hidden = !panel.hidden;
  document.getElementById("toggleComparison").textContent = panel.hidden ? "Campaign comparison" : "Hide comparison";
};
document.querySelectorAll("#filterZone,#filterStage,#filterDisposition,#filterLastContact").forEach((control) => {
  control.onchange = () => { currentPage = 0; renderRows(); };
});
document.getElementById("clearFilters").onclick = () => {
  ["filterZone","filterStage","filterDisposition","filterLastContact"].forEach((id) => { document.getElementById(id).value = ""; });
  currentPage = 0;
  renderRows();
};
document.getElementById("doNotCall").onchange = async (event) => {
  const lead = getLead(selectedIndex);
  if (!lead) return;
  lead.dnc = event.target.checked;
  if (lead.dnc) {
    lead.stageBeforeDnc = lead.stage === "Do Not Call" ? "New" : lead.stage;
    lead.stage = "Do Not Call";
  } else if (lead.stage === "Do Not Call") {
    lead.stage = lead.stageBeforeDnc || "New";
    delete lead.stageBeforeDnc;
  }
  document.getElementById("detailStage").value = lead.stage;
  document.getElementById("callLead").disabled = lead.dnc;
  document.getElementById("callLead").textContent = lead.dnc ? "Do not call" : "Call lead";
  persistActivity();
  try {
    await recordSharedAdminActivity(lead, {
      activityType:"stage_change",
      disposition:lead.disposition,
      note:lead.dnc ? "Marked Do Not Call from the admin workspace." : "Removed Do Not Call from the admin workspace.",
      durationSeconds:0,
      scheduledFor:lead.followAt ? new Date(lead.followAt).toISOString() : null,
      nextStage:lead.stage
    });
    await loadSharedPipeline({ quiet:true });
    notify(lead.dnc ? "Lead marked Do Not Call" : "Lead restored to Open");
  } catch (error) {
    notify(`${error.message || "Unable to update Do Not Call"} · saved in this browser`);
  }
};
document.getElementById("leadImport").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  const parseCsv = (csv) => {
    const rows = [[]]; let cell = "", quoted = false;
    for (let index = 0; index < csv.length; index += 1) {
      const character = csv[index], next = csv[index + 1];
      if (character === '"' && quoted && next === '"') { cell += '"'; index += 1; }
      else if (character === '"') quoted = !quoted;
      else if (character === "," && !quoted) { rows[rows.length - 1].push(cell); cell = ""; }
      else if ((character === "\n" || character === "\r") && !quoted) {
        if (character === "\r" && next === "\n") index += 1;
        rows[rows.length - 1].push(cell); cell = "";
        if (rows[rows.length - 1].some((value) => value.trim())) rows.push([]); else rows[rows.length - 1] = [];
      } else cell += character;
    }
    if (cell || rows[rows.length - 1].length) rows[rows.length - 1].push(cell);
    return rows.filter((row) => row.some((value) => value.trim()));
  };
  const rows = parseCsv(text);
  if (rows.length < 2) { notify("No lead rows found"); return; }
  const headers = rows[0].map((value) => value.trim().toLowerCase());
  const valueAt = (values, names) => { const index = headers.findIndex((header) => names.includes(header)); return index >= 0 ? (values[index] || "").trim() : ""; };
  let importedCount = 0;
  const newlyImportedLeads = [];
  let nextLeadId = leads.reduce((highest, lead) => Math.max(highest, Number(lead.id) || 0), -1) + 1;
  const importedKeys = new Set();
  const normalizedEmail = (value) => String(value || "").trim().toLowerCase();
  const normalizedPhone = (value) => String(value || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  leads.filter((lead) => lead.campaign === activeCampaign).forEach((lead) => {
    const emailKey = normalizedEmail(lead.email);
    const phoneKey = normalizedPhone(lead.phone);
    if (emailKey && emailKey !== "—") importedKeys.add(`email:${emailKey}`);
    if (phoneKey) importedKeys.add(`phone:${phoneKey}`);
  });
  rows.slice(1).forEach((values) => {
    const first = valueAt(values, ["first name","firstname","first"]), last = valueAt(values, ["last name","lastname","last"]), phone = valueAt(values, ["phone","phone number","phone number ","company phone","direct phone"]), email = valueAt(values, ["email"]), linkedin = valueAt(values, ["linkedin","linkedin url","person linkedin url"]);
    if (!first && !last && !phone && !email) return;
    if (!isDialableNorthAmericanPhone(phone)) return;
    const emailKey = normalizedEmail(email), phoneKey = normalizedPhone(phone);
    if ((emailKey && importedKeys.has(`email:${emailKey}`)) || (phoneKey && importedKeys.has(`phone:${phoneKey}`))) return;
    if (emailKey) importedKeys.add(`email:${emailKey}`);
    if (phoneKey) importedKeys.add(`phone:${phoneKey}`);
    const company = valueAt(values, ["company name","company"]) || "—";
    const title = valueAt(values, ["title","job title"]) || "—";
    const location = [valueAt(values, ["city"]), valueAt(values, ["state"]), valueAt(values, ["country"])].filter(Boolean).join(", ") || "—";
    const industry = valueAt(values, ["industry"]);
    const employees = valueAt(values, ["# employees","employees","company headcount"]);
    const revenue = valueAt(values, ["annual revenue","revenue"]);
    const notes = [industry && `Industry: ${industry}`, employees && `Employees: ${employees}`, revenue && `Revenue: ${revenue}`].filter(Boolean).join(" · ");
    const suppliedZone = normalizedTimeZone(valueAt(values, ["time zone", "timezone", "tz"]));
    const zone = suppliedZone || timeZoneFromAreaCode(phone) || "—";
    const importedLead = { id: nextLeadId++, name: `${first} ${last}`.trim() || email || phone, company, title, phone, email:email || "—", linkedin, location, zone, zoneSource: suppliedZone ? "source" : "area-code", source:"CSV import", stage:"New", followOffset:null, followAt:null, notes, disposition:"", called:false, attempts:0, dnc:false, lastContact:"", campaign:activeCampaign };
    if (!sharedWorkspace.adminMasterSynced) leads.push(importedLead);
    newlyImportedLeads.push(importedLead);
    importedCount += 1;
  });
  const campaign = campaigns.find((item) => item.id === activeCampaign);
  campaign.leads = leads.filter((lead) => lead.campaign === activeCampaign).length;
  persistActivity();
  refreshActivityViews();
  try {
    if (newlyImportedLeads.length) {
      await syncSharedOperations(newlyImportedLeads);
      await loadSharedPipeline({ quiet:true });
    }
    notify(`${importedCount} callable leads imported`);
  } catch (error) {
    notify(sharedWorkspace.adminMasterSynced ? "Import interrupted. Refresh and retry the file to finish sharing it." : `${error.message || "Unable to sync imported leads"} · saved in this browser`);
    if (sharedWorkspace.adminMasterSynced) await loadSharedPipeline({ quiet:true });
  }
  event.target.value = "";
};
document.getElementById("exportLeads").onclick = () => {
  const headers = ["Name","Phone","Email","Campaign","Stage","Disposition","Attempts","Do Not Call","Last Contact","Notes"];
  const rows = leads.map((lead) => [lead.name,formatPhone(lead.phone),lead.email,campaigns.find((campaign) => campaign.id === lead.campaign)?.name || lead.campaign,lead.stage,lead.disposition,lead.attempts,lead.dnc ? "Yes" : "No",lead.lastContact,lead.notes].map((value) => `"${String(value ?? "").replace(/"/g,'""')}"`).join(","));
  const url = URL.createObjectURL(new Blob([[headers.join(","),...rows].join("\n")], {type:"text/csv"}));
  const link = document.createElement("a"); link.href = url; link.download = "onyx-dialer-results.csv"; link.click(); URL.revokeObjectURL(url);
};
function buildCampaignReport(campaign, now = new Date()) {
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const inPeriod = (value) => Boolean(value) && new Date(value) >= weekStart && new Date(value) <= now;
  const weeklyCalls = callLog.filter((entry) => entry.campaign === campaign.name && inPeriod(entry.at));
  const successful = (entry) => ["Connected — qualified", "Connected — follow up"].includes(entry.disposition);
  const industryOf = (entry) => {
    const value = String(leads.find((lead) => lead.id === entry.leadId)?.industry || "").trim();
    return !value || value === "—" ? "Not specified" : value;
  };
  const booked = appointments.filter((entry) => entry.campaign === campaign.name && inPeriod(entry.createdAt));
  const undated = appointments.filter((entry) => entry.campaign === campaign.name && !entry.createdAt);
  const talkSeconds = weeklyCalls.reduce((total, entry) => total + Number(entry.duration || 0), 0);
  const connected = weeklyCalls.filter(successful).length;
  const rate = (count, total) => total ? `${(count / total * 100).toFixed(1)}%` : "0%";
  const industries = new Map();
  const groupFor = (entry) => {
    const name = industryOf(entry), key = name.toLowerCase();
    if (!industries.has(key)) industries.set(key, {name, calls:0, success:0, appointments:0});
    return industries.get(key);
  };
  weeklyCalls.forEach((entry) => { const group = groupFor(entry); group.calls++; if (successful(entry)) group.success++; });
  booked.forEach((entry) => groupFor(entry).appointments++);
  const rows = [
    ["Campaign overview", campaign.name],
    ["Report period (past 7 days)", `${weekStart.toLocaleString()} – ${now.toLocaleString()}`],
    ["Time zone", Intl.DateTimeFormat().resolvedOptions().timeZone],
    [],
    ["Metric", "Value"],
    ["Calls made", weeklyCalls.length],
    ["Unique leads called", new Set(weeklyCalls.map((entry) => entry.leadId)).size],
    ["Successful calls", connected],
    ["Call success rate", rate(connected, weeklyCalls.length)],
    ["Calls without disposition", weeklyCalls.filter((entry) => !entry.disposition).length],
    ["Appointments booked in period", booked.length],
    ["Recorded call duration", formatTalkTime(talkSeconds)],
    [],
    ["Industry performance"],
    ["Industry", "Calls made", "Successful calls", "Call success rate", "Appointments booked"],
    ...[...industries.values()].sort((a,b) => b.calls-a.calls || a.name.localeCompare(b.name)).map((group) => [group.name, group.calls, group.success, rate(group.success,group.calls), group.appointments]),
    ["TOTAL", weeklyCalls.length, connected, rate(connected,weeklyCalls.length), booked.length],
    [],
    ["Reporting notes"],
    ["Successful call definition", "Saved disposition is Connected — qualified or Connected — follow up. This is not a closed deal."],
    ["Activity source", "Activity recorded in this browser; not a provider-verified or multi-rep total."],
    ["Industry labels", "Current lead industry; missing labels appear as Not specified. No industries are inferred."],
    ["Appointment coverage", "Only bookings recorded in this app are included. External Calendly bookings are not synced."],
    ["Older appointments excluded from weekly booking count (booking date unavailable)", undated.length],
    [],
    ["Call detail"],
    ["Called at", "Lead", "Industry", "Phone", "Duration seconds", "Successful", "Disposition", "Notes", "Appointment noted"],
    ...weeklyCalls.map((entry) => [new Date(entry.at).toLocaleString(), entry.name, industryOf(entry), entry.phone, entry.duration || 0, successful(entry) ? "Yes" : "No", entry.disposition || "Not recorded", entry.note || "", entry.appointment || ""]),
    [],
    ["Appointments booked in period"],
    ["Booked at", "Lead", "Industry", "Meeting", "Meeting date and time"],
    ...booked.map((entry) => [new Date(entry.createdAt).toLocaleString(), entry.name, industryOf(entry), entry.type, entry.startsAt ? new Date(entry.startsAt).toLocaleString() : "Confirmed in Calendly"])
  ];
  const quote = (value) => {
    let text = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return rows.map((row) => row.map(quote).join(",")).join("\r\n");
}
document.getElementById("exportWeeklyReport").onclick = () => {
  const campaign = campaigns.find((item) => item.id === activeCampaign);
  const url = URL.createObjectURL(new Blob(["\uFEFF", buildCampaignReport(campaign)], {type:"text/csv;charset=utf-8"}));
  const link = document.createElement("a"); link.href = url; link.download = `${campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-weekly-report.csv`; link.click(); URL.revokeObjectURL(url);
  notify("Weekly client report exported");
};
function renderVoipProvider() {
  document.getElementById("voipProvider").value = voipProvider;
  document.getElementById("voipStatus").textContent = voipProvider ? `${voipProvider} selected` : "Not connected";
}

async function saveDashboardSettings() {
  const response = await fetch("/api/admin/dashboard-settings", {
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ goals, voipProvider })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to save dashboard settings");
  return payload.settings;
}

async function loadDashboardSettings() {
  try {
    const response = await fetch("/api/admin/dashboard-settings", { cache:"no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load dashboard settings");
    const settings = payload.settings || {};
    goals = {
      ...goals,
      ...(settings.goals || {}),
      callGoals: { ...(goals.callGoals || {}), ...(settings.goals?.callGoals || {}) },
      appointmentGoals: { ...(goals.appointmentGoals || {}), ...(settings.goals?.appointmentGoals || {}) },
      closeRatios: { ...(goals.closeRatios || {}), ...(settings.goals?.closeRatios || {}) },
    };
    voipProvider = settings.voipProvider || "";
    renderVoipProvider();
    renderGoals();
  } catch (error) {
    renderVoipProvider();
    notify(error.message || "Dashboard settings are unavailable");
  }
}

renderVoipProvider();
document.getElementById("saveVoipProvider").onclick = async () => {
  voipProvider = document.getElementById("voipProvider").value;
  renderVoipProvider();
  persistActivity();
  try {
    await saveDashboardSettings();
    notify(voipProvider ? `${voipProvider} selected` : "Provider selection cleared");
  } catch (error) {
    notify(`${error.message || "Unable to save provider"} · saved in this browser`);
  }
};
document.getElementById("celebrationClip").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("audio/")) { notify("Choose an audio file"); return; }
  try {
    const duration = await readClipDuration(file);
    if (!Number.isFinite(duration) || duration > 20) { notify("Choose a clip that is 20 seconds or shorter"); return; }
    const record = { blob: file, name: file.name, duration };
    await celebrationClipStore("set", record);
    if (celebrationClipUrl) URL.revokeObjectURL(celebrationClipUrl);
    celebrationClipUrl = URL.createObjectURL(file);
    updateCelebrationControls(record);
    notify("Celebration clip saved");
  } catch (error) {
    notify(error.message || "Unable to save this clip");
  }
  event.target.value = "";
};
document.getElementById("previewCelebration").onclick = playCelebration;
document.getElementById("removeCelebration").onclick = async () => {
  try {
    await celebrationClipStore("remove");
    if (celebrationClipUrl) URL.revokeObjectURL(celebrationClipUrl);
    celebrationClipUrl = "";
    updateCelebrationControls(null);
    notify("Celebration clip removed");
  } catch {
    notify("Unable to remove the clip");
  }
};
document.getElementById("saveGoals").onclick = async () => {
  const campaignId = document.getElementById("campaignSelect").value;
  goals = {
    ...goals,
    callGoals: { ...(goals.callGoals || {}), [campaignId]: Math.max(0, Number(document.getElementById("callGoalInput").value) || 0) },
    appointmentGoals: { ...(goals.appointmentGoals || {}), [campaignId]: Math.max(0, Number(document.getElementById("appointmentGoalInput").value) || 0) },
    closeRatios: { ...(goals.closeRatios || {}), [campaignId]: Math.min(100, Math.max(0, Number(document.getElementById("closeGoalInput").value) || 0)) }
  };
  persistActivity();
  renderGoals();
  try {
    await saveDashboardSettings();
    notify("Goals saved");
  } catch (error) {
    notify(`${error.message || "Unable to save goals"} · saved in this browser`);
  }
};

// The established admin workspace remains the source for the current campaign
// queue. Mirror its existing lead data into the shared service in small batches
// so contractors and admins can read the same campaign records without
// changing this interface or touching browser-local activity history.
async function syncSharedOperations(sourceLeads = leads) {
  const sharedCampaigns = campaigns.map(({ id, name }) => ({ id, name }));
  const sharedLeads = sourceLeads.filter((lead) => !lead.sharedLeadId).map((lead) => ({
    campaign: lead.campaign,
    name: lead.name,
    company: lead.company,
    title: lead.title,
    phone: lead.phone,
    email: lead.email,
    linkedin: lead.linkedin,
    location: lead.location,
    zone: lead.zone,
    source: lead.source,
    stage: lead.stage,
    disposition: lead.disposition,
    notes: lead.notes,
    followAt: lead.followAt ? new Date(lead.followAt).toISOString() : null,
    assignedTo: lead.assignedTo || lead.assigned_to || lead.follow_up_owner_email || null,
  }));
  const batchSize = 250;
  for (let start = 0; start < sharedLeads.length; start += batchSize) {
    const response = await fetch("/api/operations/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaigns: sharedCampaigns,
        leads: sharedLeads.slice(start, start + batchSize),
      }),
    });
    if (!response.ok) throw new Error("Unable to sync shared campaign data");
  }
}

campaigns.forEach((campaign) => { updateConnectRate(campaign); updateFollowups(campaign); });
if (removedNonDialableLeadCount || statsWereReset || appointmentWasCleared || quantumBomFollowupWasCleared || legacyBoardRemoved) persistActivity();
renderCampaigns();
updateMetrics(activeCampaign);
renderMiningProfile(document.getElementById("settingsGoalCampaign").value);
renderRows();
renderCallHistory();
renderCalendar();
updateTimezoneMap();
setInterval(updateTimezoneMap, 60000);
renderComparison();
renderGoals();
renderContractors();
loadContractors();
loadDashboardSettings();
loadCelebrationClip();
showView(viewFromLocation(), { updateLocation:false });
setInterval(renderRows, 60000);
setInterval(() => loadSharedPipeline({ quiet:true }), 15000);
setInterval(refreshContractorActivity, 15000);
refreshContractorActivity();
// Shared operations are now the durable source of truth. Do not re-import the
// browser's legacy sample queue on every load: real leads are added through the
// explicit CSV import flow above, while existing shared records stay intact.
loadSharedPipeline({ quiet:true })
  .catch((error) => notify(error.message || "Unable to load shared campaign data"));
