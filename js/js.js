	//获取新闻列表
	var url='http://192.168.0.213:9080/';
	var pageSize=8;
	var counts=0;
	var pagetotal=0;
	var err_ok=10000;
	var nows=0;
	var types=''
	function getNewsList(type,now){
		types=type;
		if(typeof type =='undefined'){
			type='';
			types=''
			now=1;
			nows=1;
		}else{
			nows=now
		}
		$.ajax({
			type:'get',
			url:url+'dzpk/website/getAllNews?newsType='+type+'&pageNo='+now+'&pageSize='+pageSize,
			dataType:"json",/*加上datatype*/
			crossDomain: true == !(document.all),
			success:function(msg){
				if(msg.code == err_ok){
					console.log(msg)
					var data=msg.data.list;
					counts=msg.data.recordCount;
					pagetotal=Math.ceil(counts/pageSize);
					if(pagetotal > 1){
						$('.mui-next1').removeClass('mui-disabled');
						if(now == pagetotal){
							$('.mui-next1').addClass('mui-disabled');
							$('.mui-previous1').removeClass('mui-disabled');
						}
					}else{
						$('.mui-next1').addClass('mui-disabled')
						$('.mui-previous1').addClass('mui-disabled')
					}

					var html='';
					var newsType=''
					var dateTime='';
					for(var i=0;i<data.length;i++){
						dateTime=new Date(Date.parse(data[i].createTime.replace(/-/g,"/"))).getTime();
						switch (data[i].newsType){
							case 0:
								newsType='新闻'
								break;
								case 1:
								newsType='活动'
								break;
								case 2:
								newsType='公告'
								break;
						}
						html+='<li>\
								<div class="uls2-text">\
									<span class="cont-type">['+newsType+']</span>\
									<a href="NewsDetails.html?id='+data[i].id+'">'+data[i].newsTitle+'</a>\
								</div>\
								<div class="uls2-time">'+formatDate2(dateTime)+'</div>\
							</li>';
					}
					$('.uls2').html(html);
				}
			},error:function(e){
				console.log(e)
			}
		})
	}

$('.mui-next1').bind('click',function(){
			nows++;
			if(nows > pagetotal){
				nows = pagetotal;
				if(nows>1){
					$('.mui-previous1').removeClass('mui-disabled')
				}
				$('.mui-next1').addClass('mui-disabled')
				mui.toast('没有更多数据了!')
				return;
			}
			getNewsList(types,nows)
})
$('.mui-previous1').bind('click',function(){
			nows--;
			if(nows < 1){
				nows = 1;
				$('.mui-previous1').addClass('mui-disabled')
				mui.toast('已经到顶了!')
				return;
			}
			getNewsList(types,nows)
})

//获取轮播图
 function getImg(picType){
 	$.ajax({
 		type:'get',
		url:url+'dzpk/website/getAllPic?picType='+picType,
		dataType:"json",
		crossDomain: true == !(document.all),
		success:function(msg){
			var data=msg.data
			if(msg.code == err_ok){
				if(picType == 0){
					runHtmlX(data)
				}else{
					runHtmlD(data)
				}
			}

		},
		error:function(e){

		}
 	})
 }
function runHtmlX(data){
	var htmlX='';
	for (var i=0;i<data.length;i++) {
		htmlX +='<div class="swiper-slide">\
	            	 <img src="'+data[i].picUrl+'"/>\
	             </div>';
	}
	$('.swiper-wrapper2').html(htmlX);
	var swiper2 = new Swiper('.swiper-container2', {
		        pagination: '.swiper-pagination2',
		        slidesPerView: 1,
		        paginationClickable: true,
		        loop: true,
		        paginationClickable: true,
		        centeredSlides: true,
		        autoplay: 1500,
		    });
}
function runHtmlD(data){
var htmlD='';
	for (var i=0;i<data.length;i++) {
		htmlD +='<div class="swiper-slide">\
	            	<img src="'+data[i].picUrl+'"/>\
	            </div>';
	}
	$('.swiper-wrapper0').html(htmlD);
	var swiper1 = new Swiper('.swiper-container1', {
		        pagination: '.swiper-pagination1',
		        nextButton: '.swiper-button-next1',
       			prevButton: '.swiper-button-prev1',
		        effect: 'coverflow',
		        grabCursor: true,
		        centeredSlides: true,
		        initialSlide: 1,
		        slidesPerView: 'auto',
		        coverflow: {
		            rotate: 50,
		            stretch: 0,
		            depth: 100,
		            modifier: 1,
		            slideShadows : true
		        }
		    });
}

//获取首页新闻
function getIndexNews(type){
	if(typeof type == 'undefined'){
		type="";
	}
	$.ajax({
			type:'get',
			url:url+'dzpk/website/getAllNews?newsType='+type,
			dataType:"json",/*加上datatype*/
			crossDomain: true == !(document.all),
			success:function(msg){
				if(msg.code == err_ok){
					var data=msg.data.list;
					runHtmlIndex(data)
				}else{
					mui.toast('服务器异常...');
					$('.firstHtml').html('服务器异常...')
				}
			},
			error:function(e){
				mui.toast('服务器异常...')
				$('.firstHtml').html('服务器异常...')
			}
		})
}
function runHtmlIndex(data){
	if(!data){
		$('.firstHtml').html('暂无数据...')
		return
	}
	var html="";
	var dateTime='';
	var firstTitle=data[0].newsTitle
	for (var i=1;i<data.length;i++) {
		dateTime=new Date(Date.parse(data[i].createTime.replace(/-/g,"/"))).getTime();
		switch (data[i].newsType){
			case 0:
				newsType='新闻'
				break;
				case 1:
				newsType='活动'
				break;
				case 2:
				newsType='公告'
				break;
		}
		html+='<li>\
					<p>\
						<span class="zx-gg"><em class="bold">【</em>'+newsType+'<em class="bold">】</em></span>\
						<a href="NewsDetails.html?id='+data[i].id+'" class="zx-text">'+data[i].newsTitle+'</a>\
					</p>\
					<span class="zx-time">'+formatDate(dateTime)+'</span>\
				</li>'
	}
	$('.firstHtml').html(firstTitle)
	$('.zx-detail').html(html)

}
//获取新闻详情
	function newsDetail(id){
		if(!id){
			return
		}
		$.ajax({
			type:'get',
			url:url+'dzpk/website/getNews?id='+id,
			dataType:"json",
			crossDomain: true == !(document.all),
			success:function(msg){
				if(msg.code == err_ok){
					var data=msg.data;
					runNews(data)
				}else{
					mui.toast('服务器异常...');
//					$('.firstHtml').html('服务器异常...')
				}
			},
			error:function(e){
				mui.toast('服务器异常...')
//				$('.firstHtml').html('服务器异常...')
			}
		})
	}

//渲染详情
function runNews(data){
	var timer=new Date(Date.parse(data.createTime.replace(/-/g,"/"))).getTime();
	if(!data){
		var html='<div class="gsjs xwxq">\
				<h3>暂无数据...</h3>\
			 </div>';
	}else{
		var html='<div class="gsjs xwxq">\
				<h3>'+data.newsTitle+'</h3>\
				<p>发布日期：<span>'+formatDate2(timer)+'</span></p>\
			 </div>\
			 <div class="gsjs lxfs xwxqText noborder">\
				<p>'+data.newsContent+'</p>\
			 </div>';
	}

	$('.cont-ul2').html(html)
}

//时间转换1
function formatDate(now) {
	now=new Date(now)
    var year=now.getYear()-100;
    var month=now.getMonth()+1;
    var date=now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();
    var datea;

    if((now.getMonth()+1)<10){
        month='0'+parseInt(now.getMonth()+1);
    }
    if(now.getDate()<10){
        date='0'+now.getDate();
    }
    return '['+month+"/"+date+']';
}
//时间转换2
function formatDate2(now) {
	now=new Date(now)
    var year=now.getYear()-100;
    var month=now.getMonth()+1;
    var date=now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();
    var datea;

    if((now.getMonth()+1)<10){
        month='0'+parseInt(now.getMonth()+1);
    }
    if(now.getDate()<10){
        date='0'+now.getDate();
    }
    return '20'+year+'-'+month+"-"+date;
}
//获取url参数
function queryId(n){
	var url=location.search;
	var obj={};
	if(url.indexOf('?') >-1){
		url=url.substr(1).split('&');
		for(var i in url){
			obj[url[i].split('=')[0]]=url[i].split('=')[1];
		}
	}
	return obj[n]
}








