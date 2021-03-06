/*==================================================
 *  Simile Backstage API
 *==================================================
 */

(function() {
    var loadMe = function() {
        if (typeof window.Backstage != "undefined") {
            return;
        }
        
        window.Backstage = {
            loaded:     false,
            params:     { bundle: false, autoCreate: true },
            namespace:  "http://simile.mit.edu/2006/11/backstage#",
            locales:    [ "en" ]
        };
        
        var javascriptFiles = [
            "backstage.js",
            "util/sha1.js",
            "util/json.js",
            "util/jsonp-transport.js",
            "util/job-queue.js",
            "data/collection.js",
            "data/expression.js",
            "ui/ui.js",
            "ui/ui-context.js",
            "ui/lens.js",
            "ui/views/tile-view.js",
            "ui/facets/list-facet.js"
        ];
        var cssFiles = [
            "backstage.css",
        ];
        
        var defaultClientLocales = ("language" in navigator ? navigator.language : navigator.browserLanguage).split(";");
        for (var l = 0; l < defaultClientLocales.length; l++) {
            var locale = defaultClientLocales[l];
            if (locale != "en") {
                var segments = locale.split("-");
                if (segments.length > 1 && segments[0] != "en") {
                    Backstage.locales.push(segments[0]);
                }
                Backstage.locales.push(locale);
            }
        }

        var paramTypes = { bundle:Boolean, autoCreate:Boolean };
        if (typeof Backstage_urlPrefix == "string") {
            Backstage.urlPrefix = Backstage_urlPrefix;
            if ("Backstage_parameters" in window) {
                SimileAjax.parseURLParameters(Backstage_parameters,
                                              Backstage.params,
                                              paramTypes);
            }
        } else {
            var url = SimileAjax.findScript(document, "/backstage-api.js");
            if (url == null) {
                Backstage.error = new Error("Failed to derive URL prefix for Simile Backstage API code files");
                return;
            }
            Backstage.urlPrefix = url.substr(0, url.indexOf("backstage-api.js"));
        
            SimileAjax.parseURLParameters(url, Backstage.params, paramTypes);
        }

        if (Backstage.params.locale) { // ISO-639 language codes,
            // optional ISO-3166 country codes (2 characters)
            if (Backstage.params.locale != "en") {
                var segments = Backstage.params.locale.split("-");
                if (segments.length > 1 && segments[0] != "en") {
                    Backstage.locales.push(segments[0]);
                }
                Backstage.locales.push(Backstage.params.locale);
            }
        }

        var scriptURLs = Backstage.params.js || [];
        var cssURLs = Backstage.params.css || [];
        
        /*
         *  Core scripts and styles
         */
        if (Backstage.params.bundle) {
            scriptURLs.push(Backstage.urlPrefix + "backstage-bundle.js");
            cssURLs.push(Backstage.urlPrefix + "backstage-bundle.css");
        } else {
            SimileAjax.prefixURLs(scriptURLs, Backstage.urlPrefix + "scripts/", javascriptFiles);
            SimileAjax.prefixURLs(cssURLs, Backstage.urlPrefix + "styles/", cssFiles);
        }
        
        /*
         *  Localization
         */
        for (var i = 0; i < Backstage.locales.length; i++) {
            scriptURLs.push(Backstage.urlPrefix + "locales/" + Backstage.locales[i] + "/locale.js");
        };
        
        /*
         *  Autocreate
         */
        if (Backstage.params.autoCreate) {
            scriptURLs.push(Backstage.urlPrefix + "scripts/create.js");
        }
        
        SimileAjax.includeJavascriptFiles(document, "", scriptURLs);
        SimileAjax.includeCssFiles(document, "", cssURLs);
        Backstage.loaded = true;
    };

    loadMe();
})();
