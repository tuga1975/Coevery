﻿namespace Coevery.Core.Contents.Settings {
    public class ContentTypeSettings {
        /// <summary>
        /// Used to determine if an instance of this content type can be created through the UI
        /// </summary>
        public bool Creatable { get; set; }
        /// <summary>
        /// Used to determine if this content type supports draft versions
        /// </summary>
        public bool Draftable { get; set; }
        /// <summary>
        /// Defines the stereotype of the type
        /// </summary>
        public string Stereotype { get; set; }
    }
}