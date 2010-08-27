Overlay ���б���


Ӧ�ó���
 - ҳ���ϵĸ��ǲ�, ��, ��ͨ���ֲ�;
 - �����Ի����; 


ͬ�����
1. YUI3 , `Overlay <http://developer.yahoo.com/yui/3/overlay/>`_
 * new Y.Overlay(cfg);
 * ��չ��Widget, DOM�����ṹ����hd,bd,ft;
 * �ṩ λ���������(x, y, xy, centered), zIndex, align, shim(��iframe, IE6��Ĭ��true), constrain(�̶��ڿ��������м�);
 * �ṩ ���޸Ķ�Ӧ Attributes �ķ���, ��Ҫ�� ����(WidgetStdMod), λ��(WidgetPosition, WidgetPositionConstrain), ��С�⼸������ķ���;
 * WidgetPositionAlign, �ṩ Align, ֧�ֶ��뵽ĳ��Ԫ��, ������������, �ض�λ����;
 * WidgetStack, �ṩ Stacking, ��ҪzIndex��shim֧��, ���ж�� Overlay ʱ, ĳ�����ý���ʱ, �������ڶ���(��Ӧ���� bringToTop )
 * �Զ����¼� xyChange, bodyContentChange, 
 * Overlay��ص�Plugin, ͨ�� overlay.plug(XXX, cfg)/ overlay.unplug(XXX) ʹ��:
    # StdModIO, �ṩ��׼���������, ����initializer, destructor, formator, ��Overly��ʵ����Ϊoverlay.io;
    # Animation, �ṩOverly�Ķ���չ��Ч��, animHidden/animVisible�������չ��;


2. JQuery UI, û���ṩ Overlay , ���ṩ����������Ļ��� Widget, ��չ�� `Dialog <http://docs.jquery.com/UI/Dialog>`_ , ��������, �� Draggable(��ק), Droppable, Resizable.
 * JQuery Core + Widget + Position + Dialog, ѹ����21K;
 * `Widget <http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.js>`_ , ��������Ļ���, �ṩ create, destroy, enable, disable��ͨ�÷���;
 * ʹ�� $(id).dialog();
   # �ṩ ���ƿ�߶�, resize, λ��, �Ƿ�ģ̬����, ����ק, ֧�� ��ť;
   # �ṩ�ķ����� destroy, open, close, enable, disable, moveToTop, stack, ��Щ�������ƴ���������ķ���;
   # �Զ����¼��� open, close, beforeClose, focus, drag ��;



3. Mootools, �� moord �ṩ�� `overlay.js <http://www.moord.it/documentation/constructors>`_ 
 * 77.3K (δѹ��, ���������ļ�), ���� Overlay ��100����;
 * new Overlay() ���� overlay ����;
 * �ṩ ����, ɾ�� Overlay, ���� ��ɫ��ǳ ͸����, ���ܱȽϼ�;
 * ����Overlay��չ������� virtual box , �����㹦��:
   # virtual-base Ϊ����;
   # ��չ�� virtual-box (������box),  virtual-ajax (����֮����ʾ����), virtual-html (��̬����html����);
   # virtual box ϵ�� �ṩ ���ö���Ч��, �Զ�����ʽ, λ�þ��е�ѡ��, �ṩ onShow, onClose, onNext, onPrev �Զ����¼�;



4. Dojo �� Dijit �ṩ�� `digit.Dialog <http://dojotoolkit.org/reference-guide/dijit/Dialog.html>`_ .
 * Dialog+DialogUnderlay ��22K, ������һЩ������.
 * new dijit.Dialog(cfg);
 * ֧��resize, ��ק, ������, ����������, ���ظ�����;
 * ����Ĵ���;



���ܵ����
- ���ݲ�: 
    * ���ݵĿ��Զ�������:
        # �������� hd, bd, ft ����������;X
        # 
    * ��̨��������Ķ�̬����;
        # ������;
        # iframe;
        # ajax;
    * ���ݽ�������ʽ��:
        # json;
        # formator;
- չ�ֲ�: 
    * ��С:
        # ���ÿ��/�߶�;X
        # resize;X
    * λ��:
        # ����λ��;X
        # �����Ԫ�ص�λ��;X
        # zIndex, shim X, stack;
    * ����:
        # �����Ԫ�صĶ���;X
        # ����������������ڵĶ���;X
    * ����:
        # ��Ҫ������ʾ/����Overlayʱ�Ķ���Ч��, ֱ������kissy/anim, ���� switchable �� plugin-effect;

- ����:
    * ֧�ְ�ť?
    * Drag + Drop?



�����뷨
1) S.Overlay(�ο���ds�е�dialog.js/dialogable.js)
- Constructor, new S.Overlay(cfg)
    * cfg: ������Ϣ;
    * ���� Overlay ʵ��;

- Config
    * srcNode: Ԫ�ؽڵ�, Ĭ��Ϊnull, �½�һ���ڵ�;X
    * head: 'header';X
    * body: 'body';X
    * foot: 'footer';X
    * url: ������ʱΪ��̬����, ����ʱ�������ݺ��滻body;

    * width/height: ���/�߶���Ϣ;X
    * align: {};X
        # node ����Ԫ��'', ָ��Ԫ��isString, ��������null;
        # x: l, c, r, or interger
        # y: t, c, b, or interger
        # inner: false
    * mask: ��ʾ�Ͳ�;X
    * shim: ���IE6�ر�;X
    * zIndex: �����ʱ���Ŵ���;
    * scroll: �Ƿ�̶��ڿ���������;X
    
- Method
    * setHeader;X
    * setBody;X
    * setFooter;X
    * setPosition;X

    * show;X
    * hide;X
    * center;X
    * bringToTop;

- Event X
    * afterInit;
    * afterFirstRender;
    * changeBody;
    * changeHeader;
    * changeFooter;
    * center;
    * changePosition;
    * onShow;
    * onHide;

2) S.Overlay.Effect
3) S.Overlay.Request
4) Dialog/Popup










http://10.1.6.138:8080/qcbin/start_a.htm

S.Overlay.create = function(trigger, cfg) {
    var ret = [];
    if (S.isString(trigger)) {
        S.each(DOM.query(trigger), function(t) {
            ret.push(new Overlay(t, cfg));
        });
        return ret.length === 1 ? ret[0] : ret;
    }
    return null;
}
