const fetchData = async (body)=>{
    const res = await fetch(`https://us-central1-bossnet-dev.cloudfunctions.net/getReviews`, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    const data = await res.json();
    if(data?.message === 'Success'){        
        return data?.data[0];
    }else alert("Something went wrong!")                
    return [];
}

const renderData = async(currentWidget, templateId) => {
    const snippetData = await fetchData({template_id: templateId});
    // update widget theme and text color
    currentWidget.parentNode.style.background = snippetData?.background;
    currentWidget.parentNode.style.width = !snippetData?.isWidthAuto ? (snippetData?.width + 'px') : 'auto';
    currentWidget.parentNode.style.height = !snippetData?.isHeightAuto ? (snippetData?.height + 'px') : 'auto';
    currentWidget.previousElementSibling.style.color = snippetData?.theme === 'dark' ? 'white' : 'black';
    
    //  appends badge to the widget container
    snippetData?.skills.forEach((item, index) => {
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'position-relative d-flex justify-content-center align-items-center';
        const img = document.createElement('img');
        img.width = 82;
        img.height = 94;
        img.src = `"https://${window.location.host}`+ snippetData?.skill_srcs[index];
        const skillText = document.createElement('span');
        skillText.className = 'd-flex position-absolute fs10 fontDMSans justify-content-center text-center';
        skillText.style.color = (snippetData?.clients[index] === 'Verified') ? 'white' : 'black';
        skillText.style.width = '80px';                        
        skillText.innerText = item.toUpperCase();
        badgeContainer.appendChild(img);
        badgeContainer.appendChild(skillText);
        currentWidget.appendChild(badgeContainer);        
    })  
}

const widgets = document.getElementsByClassName('bossnet-badge-widget');
for (let index = 0; index < widgets.length; index++) {
    const widget = widgets[index];                
    const templateId = widget.dataset.templateId;
    renderData(widget, templateId);                
}           